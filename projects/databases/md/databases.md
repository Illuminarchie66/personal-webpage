# Introduction
This was my year 2 databases coursework! The idea behind this was to introduce a database system with SQL, linking it with Java, so that we can perform different operations efficiently. It was using the premise of a gig/concert management system. We had a PostgreSQL database backend, and a Java frontend using JDBC to interface with it. We managed acts, venues, gigs, tickets and customers; and we had 8 tasks which were referred to as *options*. These were different ways for the user to interact with the database via a command-line menu. We were to implement these options, as well as improving the design of the database.

# Design
We were given a pre-existing schema of six tables: `act`, `venue`, `gig`, `ticket`, `act_gig`, and `gig_ticket`. The first four tables have `SERIAL` (auto-incrementing) primary keys `actID`, `venueID`, `gigID`, `ticketID`, and represent the acts (performances in a gig), venues (locations where gigs are performed), gigs (events at a venue with multiple acts) and tickets (tickets bought for each gig). `act_gig` resolves a many-to-many relationship between acts and gigs, with composite primary key `(actID, gigID, ontime)`. We include `ontime` as an act can perform multiple times at a gig. `gig_ticket` resolves how there can be multiple types of ticket prices, using a composite key of `(gigID, pricetype)`.

In the original schema, there was a key violation with the `ticket` table, breaching 3rd Normal Form (3NF), as `customername` is transitively dependent on `customeremail`, not directly on `ticketID`. A customer can be uniquely identified by their email, and their name for the email used is the same each time. This imposes a transitive relationship between `customeremail` and `customername`, which violates the requirement that all non-key attributes depend solely on the primary key. We solve this similarly to how `act_gig` is implemented, by introducing two new tables and changing the attributes of the `ticket` table:

```
tickets:
    - ticketID PRIMARY KEY
    - gigID REFERENCES gig
    - pricetype

ticket_customer:
    - ticketID REFERENCES ticket
    - customerID REFERENCES customer
    - cost

customer:
    - customerID PRIMARY KEY
    - customername
    - customeremail
    - (..other personal details)
```

This allows for customers to buy multiple tickets in a way that avoids a many-to-many relationship between tables.

As for other changes and improvements to the database design, there are a few type changes that may be more useful and reflective of real world data. For example, all cost/price entries should be `FLOAT`, to enable pennies and pounds rather than just whole pounds (assuming English currency). Additionally, `gigdate` should be renamed to `gigtime`, as it stores the time of the gig, not just the date, which is confusing. The most crucial improvement is the separation of `ticket` and `customer`, which would have certainly streamlined the later options.

The schema that was implemented for the options was as follows:

```sql
CREATE TABLE act(
    actID SERIAL NOT NULL PRIMARY KEY,
    actname VARCHAR(100) NOT NULL UNIQUE,
    genre VARCHAR(10) NOT NULL,
    standardfee INTEGER NOT NULL CHECK (standardfee>=0) 
);

CREATE TABLE venue(
    venueid SERIAL NOT NULL PRIMARY KEY,
    venuename VARCHAR(100) NOT NULL UNIQUE,
    hirecost INTEGER NOT NULL CHECK (hirecost>=0),
    capacity INTEGER NOT NULL 
);

CREATE TABLE gig(
    gigID SERIAL NOT NULL PRIMARY KEY,
    venueid INTEGER NOT NULL REFERENCES venue(venueid),
    gigtitle VARCHAR(100) NOT NULL,
    gigdate TIMESTAMP NOT NULL,
    gigstatus VARCHAR(10) NOT NULL
    CONSTRAINT gigstatus_value CHECK (gigstatus='Cancelled' OR gigstatus='GoingAhead')
);

CREATE TABLE ticket(
    ticketid SERIAL NOT NULL PRIMARY KEY,
    gigID INTEGER NOT NULL REFERENCES gig(gigID),
    pricetype VARCHAR(2) NOT NULL,
    cost INTEGER NOT NULL CHECK (cost>=0),
    customername VARCHAR(100) NOT NULL,
    customeremail VARCHAR(100) NOT NULL
);

CREATE TABLE act_gig(
    actID INTEGER NOT NULL REFERENCES act(actID),
    gigID INTEGER NOT NULL REFERENCES gig(gigID),
    actfee INTEGER NOT NULL CHECK (actfee>=0),
    ontime TIMESTAMP NOT NULL,
    duration INTEGER NOT NULL,
    PRIMARY KEY (actID, gigID, ontime)
);

CREATE TABLE gig_ticket(
    gigID INTEGER NOT NULL REFERENCES gig(gigID),
    pricetype VARCHAR(2) NOT NULL,
    price INTEGER NOT NULL CHECK (price>=0),
    PRIMARY KEY (gigID, pricetype)
);
```

We impose some standard constraints, such as enforcing anything of monetary value to be non-negative, ensuring necessary fields are not null, and including the correct `REFERENCES` and `PRIMARY KEY` declarations.

# Options
There were 8 options to implement through the Java inside of `GigSystem.java`. Much of the boilerplate code was already written, using a switch case over the command-line input and establishing a JDBC connection, so we could focus on implementing the options themselves. They consisted of adding to the database, editing it, and retrieving information.

---

## Option 1

**Input:**
- `gigID` (integer)

**Output:**
- Table: `actname` | `ontime` | `offtime`

This was the introductory task. Given a `gigID`, we retrieve the `actname`, `ontime` and `offtime` of each act in order. The approach is:
1. `JOIN` `act` and `act_gig` on `actID`.
2. Filter by the provided `gigID`.
3. Compute `offtime` as `ontime + duration`, using `make_Interval(mins => duration)` for the addition.
4. Order by `ontime` ascending.

```sql
SELECT actname, ontime, (ontime + (SELECT make_Interval(mins => (duration)))) AS offtime 
FROM act_gig JOIN act ON act_gig.actID=act.actID 
WHERE act_gig.gigID = ? 
ORDER BY ontime
```

`?` is the prepared statement placeholder, assigned the input `gigID`.

---

## Option 2

**Input:**
- `venue` (String)
- `gigTitle` (String)
- `actIDs` (int[])
- `fees` (int[])
- `onTimes` (LocalDateTime[])
- `durations` (int[])
- `adultTicketPrice` (integer)

**Output:**
- void

This option adds a new gig with acts, enforcing a set of complex scheduling constraints. The core constraints are:
- No overlapping acts within a gig.
- Acts cannot perform in multiple gigs at the same time.
- Acts can perform multiple times at the same gig (e.g., a first half, then an interval, then a second half).
- Acts performing at multiple venues on the same day need a 20-minute travel gap between them.
- No gap between consecutive acts greater than 20 minutes.
- The first act must start at the gig's start time.
- No act may run past 23:59.
- Multiple gigs at the same venue must have a minimum 3-hour gap between them.

Our approach is to insert the gig, then check whether the database is in a valid state, rolling back if not. We set `autoCommit` to false and place a savepoint before any inserts, so we can rollback cleanly if anything fails.

We first retrieve the `venueID` from the `venue` table using the unique venue name. We then insert the gig using the `venueID`, `gigTitle`, and the first `ontime` as the gig start time. We use `RETURN_GENERATED_KEYS` to immediately retrieve the generated `gigID` for use in the `act_gig` insertions.

We then loop through the input arrays (`actIDs`, `fees`, `onTimes`, `durations`) and insert each into `act_gig`. After each insert, we check how many rows were affected. If `s = 0`, no row was added — either due to a constraint violation (primary/foreign key) or because a `BEFORE INSERT` trigger rejected it. In that case we rollback immediately.

The trigger, `validAct`, fires before each insert into `act_gig`:

```sql
CREATE TRIGGER validAct BEFORE INSERT ON act_gig
    FOR EACH ROW 
    EXECUTE PROCEDURE validGigTime();
```

Inside `validGigTime`, we check for two things: act overlap within the gig (using the SQL `OVERLAPS` function over `ontime` and `duration`), and whether the act runs past 23:59. If either fails, the trigger returns `NULL`, cancelling the insert.

Once all `act_gig` rows are inserted, we call `gigCheck()`, which returns an integer: `0` means valid, `1–5` indicates a specific constraint violation (used for debugging). We rollback if non-zero. The five checks within `gigCheck()` are:

**`checkAllActsGig()`** — iterates over all acts and calls `multiGigFailActs(actID)`, which checks whether an act has less than 20 minutes between back-to-back appearances at different venues. It does this by ordering all of an act's gig appearances by `ontime`, then self-joining on consecutive rows where the venue differs:

```sql
CREATE OR REPLACE FUNCTION multiGigFailActs(id INTEGER)
    RETURNS BOOLEAN 
    LANGUAGE plpgsql
    AS 
    $$  
        DECLARE 
            actsInGigs INTEGER;
        BEGIN 
            WITH actOrder AS(
                SELECT *, ROW_NUMBER() OVER(ORDER BY act_gig.ontime) AS R 
                FROM act_gig NATURAL JOIN gig 
                WHERE act_gig.actid = id AND (gig.gigstatus='GoingAhead')
            )
            SELECT * INTO actsInGigs 
            FROM actOrder a1 INNER JOIN actOrder a2 on a1.r=a2.r+1
            WHERE ((a1.gigid != a2.gigid) 
            AND (a1.venueid != a2.venueid)
            AND (a1.ontime - (a2.ontime + (SELECT make_Interval(mins=>(a2.duration)))) 
            < (SELECT make_Interval(mins=>20))));
        
            IF actsInGigs != 0 THEN
                RETURN true;
            END IF;
            RETURN false;
        END;
    $$;
```

**`multiGigFailVenues()`** — checks that multiple gigs at the same venue have at least a 3-hour gap between them. Uses the same self-join pattern, building a `gigOrder` CTE with both a `starttime` and computed `endtime` per gig, then checking the gap between consecutive gigs at the same venue.

**`checkAllGaps()`** — iterates over all gigs and calls `gapsBiggerThan20(gigID)`, which orders acts by `ontime` within a gig, self-joins on consecutive rows, and checks whether the gap between one act ending and the next starting exceeds 20 minutes.

**`actFailDateCheck()`** — checks that no act starts before the gig's `gigdate`, or appears on a different day entirely.

**`firstInGig()`** — checks that the first act in each gig starts at exactly the gig's `gigdate`, using the `firstActs` view.

We have two persistent views used throughout the project — `headlines`, which identifies the last act in each gig, and `firstActs`, which identifies the first:

```sql
CREATE OR REPLACE VIEW headlines 
AS SELECT actname, gigid, max(ontime) 
FROM (
    SELECT * 
    FROM act NATURAL JOIN act_gig NATURAL JOIN gig 
    WHERE gig.gigstatus = 'GoingAhead' 
    AND act.actid = (
        SELECT actid 
        FROM act_gig 
        WHERE act_gig.gigid = gig.gigid 
        ORDER BY act_gig.ontime DESC LIMIT 1
    )
) AS temp1 
GROUP BY actname, gigid;

CREATE OR REPLACE VIEW firstActs 
AS SELECT actname, gigid, min(ontime) 
FROM (
    SELECT * 
    FROM act NATURAL JOIN act_gig NATURAL JOIN gig 
    WHERE gig.gigstatus = 'GoingAhead' 
    AND act.actid = (
        SELECT actid 
        FROM act_gig 
        WHERE act_gig.gigid = gig.gigid 
        ORDER BY act_gig.ontime ASC LIMIT 1
    )
) AS temp2 
GROUP BY actname, gigid;
```

If any check in `gigCheck()` fails, we rollback through Java. The rollback logic is kept in Java rather than a stored procedure, as JDBC savepoints are cleaner to manage from the application layer.

---

## Option 3

**Input:**
- `gigID` (integer)
- `name` (String)
- `email` (String)
- `ticketType` (String)

**Output:**
- void

This option allows a customer to buy a ticket for a gig, providing their name, email, and a price type (e.g. `'A'` for adult). Three conditions must all pass for the insert to go ahead:

- There are tickets still available, i.e. the current ticket count for that gig is less than the venue's capacity.
- The gig status is `'GoingAhead'` and not `'Cancelled'`.
- The requested price type exists in `gig_ticket` for that gig.

If any condition fails, the ticket is not inserted, and the database state is unchanged. This is handled with cascading `IF` statements in a stored procedure. We check capacity with:

```sql
IF (
    SELECT COUNT(*) FROM ticket WHERE ticket.gigID = id
) < (
    SELECT capacity FROM gig JOIN venue ON gig.venueid = venue.venueid WHERE gig.gigID = id
)
```

And price type validity with:

```sql
IF (
    SELECT COUNT(*) FROM gig_ticket 
    WHERE gig_ticket.gigID = id AND gig_ticket.pricetype = ticktype
) != 0
```

If all conditions pass, we `INSERT` into `ticket`, looking up the cost from `gig_ticket` rather than accepting it as input — the user cannot supply an arbitrary price.

---

## Option 4

**Input:**
- `gigID` (integer)
- `actName` (String)

**Output:**
- `String[]` of distinct customer emails if the gig is cancelled
- `null` if the act is removed without issue

This option removes an act from a gig. If any of the following conditions are met, the entire gig is cancelled:

- The act being removed is the headline act.
- The act being removed is the first act (since this would violate the constraint that the first act starts at `gigdate`).
- Removing the act creates a gap greater than 20 minutes between the remaining acts.

We evaluate the headline and first act conditions before the deletion using the `headlines` and `firstActs` views. We then delete the act from `act_gig`, and call `checkAllGaps()` afterwards — this order is intentional, as the gap check must reflect the state after removal. If any condition is true, we set `gigstatus` to `'Cancelled'`, update all ticket costs to `0`, and return `1`. Otherwise we return `0`.

```sql
CREATE OR REPLACE FUNCTION option4(id INTEGER, actNme VARCHAR(100))
    RETURNS INTEGER
    LANGUAGE plpgsql
    AS
    $$
        DECLARE 
            deleteID INTEGER;
            condition1 BOOLEAN;
            condition2 BOOLEAN;
        BEGIN 
            SELECT actid INTO deleteID FROM act WHERE act.actname=actNme;
            SELECT EXISTS(SELECT * FROM headlines 
                          WHERE headlines.gigid=id AND headlines.actname=actNme
                         ) INTO condition1;
            SELECT EXISTS(SELECT * FROM firstActs 
                          WHERE firstActs.gigid=id AND firstActs.actname=actNme
                         ) INTO condition2;

            DELETE FROM act_gig WHERE act_gig.gigID = id AND act_gig.actID = deleteID;

            IF checkAllGaps() OR condition1 OR condition2 THEN 
                UPDATE gig SET gigstatus = 'Cancelled' WHERE gig.gigId = id;
                UPDATE ticket SET cost = 0 WHERE ticket.gigID = id;
                RETURN 1;
            ELSE
                RETURN 0;
            END IF;
        END;
    $$;
```

If Java receives a `1`, it runs a follow-up query to retrieve the affected customers:

```sql
SELECT DISTINCT customeremail FROM ticket WHERE ticket.gigid = ? ORDER BY customeremail
```

The result is converted to a `String[]` using the helper `convertToSingleCol()`. Otherwise `null` is returned.

It is worth noting this option is bad practice — `DELETE` and `UPDATE` statements inside a SQL function rather than a procedure. This was done because the Java interface required either a `null` or a list return, and a procedure cannot return values. A cleaner solution would separate the update logic, but I found this unnecessarily complex for the requirements.

---

## Option 5

**Input:**
- None

**Output:**
- Table: `gigID` | `ticketsToSell`

For each gig, this option calculates the number of additional tickets that must be sold to break even. The formula used is:

$$
\text{Tickets still needed} = \left\lceil \frac{\text{Sum of act fees} + \text{Venue hire cost} - \text{Revenue so far}}{\text{Adult ticket price}} \right\rceil
$$

`CEILING` is used since we cannot sell a fraction of a ticket. This is computed by the `summy(gigID)` SQL function, which collects each component individually using aggregate functions:

```sql
CREATE OR REPLACE FUNCTION summy(id INTEGER)
    RETURNS INTEGER 
    LANGUAGE plpgsql
    AS 
    $$
        DECLARE
            cost1 INTEGER;
            cost2 INTEGER;
            saved INTEGER;
            Aprice INTEGER;
            final INTEGER;
        BEGIN 
            SELECT SUM(actfee) INTO cost1 FROM act_gig WHERE gigid=id;
            SELECT hirecost INTO cost2 FROM gig JOIN venue ON gig.venueid = venue.venueid WHERE gigid=id;

            IF (SELECT COUNT(*) FROM ticket WHERE gigid=id) = 0 THEN
                SELECT 0 INTO saved;
            ELSE 
                SELECT SUM(cost) INTO saved FROM ticket WHERE gigid=id;
            END IF;

            SELECT price INTO Aprice FROM gig_ticket WHERE gigID=id AND pricetype='A';
            IF Aprice = 0 THEN
                RETURN 0;
            END IF;

            SELECT CEILING((cost1+cost2-saved)/Aprice) INTO final; 
            RETURN final;
        END;
    $$;
```

Two edge cases are handled. If no tickets have been sold yet, `SUM` would return `NULL`, so we explicitly set `saved = 0` when the ticket count is `0`. If the adult ticket price is `0` (a free event), we return `0` to avoid a division by zero — it is assumed a free event is not attempting to break even.

---

## Option 6

**Input:**
- None

**Output:**
- Table: `actname` | `year` | `totalticketssold`

This option breaks down headline act ticket sales by year, including a `'Total'` row per act summing across all years. It is built from four chained CTEs.

The first, `tixSoldPerGig`, uses the `headlines` view to find the year and ticket count for each headline gig:

```sql
WITH tixSoldPerGig AS (
    SELECT 
        headlines.actname, 
        extract(year from max)::VARCHAR(10) AS year, 
        (
            SELECT COUNT(*) 
            FROM gig NATURAL JOIN ticket 
            WHERE gig.gigstatus='GoingAhead' 
            AND ticket.gigid=headlines.gigid
        ) AS totalticketssold 
    FROM headlines
)
```

`tixSoldPerYear` then groups by actname and year, summing ticket counts across multiple headline gigs in the same year.

`totals` unions `tixSoldPerYear` with a version of itself where `year` is replaced with `'Total'` and tickets are summed per act — producing both per-year and total rows in one table:

```sql
totals AS (
    SELECT * FROM tixSoldPerYear 
    UNION (
        SELECT 
            tixSoldPerYear.actname, 
            'Total' AS year, 
            SUM(tixSoldPerYear.totalticketssold)::BIGINT 
        FROM tixSoldPerYear 
        GROUP BY tixSoldPerYear.actname
    )
)
```

Finally, we join `totals` against itself filtered to `year = 'Total'` to attach each act's overall total as an invisible ordering column, then sort by that total, actname, and year:

```sql
SELECT 
    totals.actname, 
    totals.year::VARCHAR(10), 
    totals.totalticketssold
FROM totals JOIN (
    SELECT totals.actname, totals.totalticketssold 
    FROM totals WHERE totals.year = 'Total'
) AS x ON totals.actname = x.actname 
WHERE totals.totalticketssold != 0 
ORDER BY x.totalticketssold, totals.actname, totals.year;
```

Acts with zero total tickets sold are excluded, following the behaviour of the test data. CTEs are used throughout rather than views, as scoped views are poor practice and these aliases are only needed locally.

---

## Option 7

**Input:**
- None

**Output:**
- Table: `actname` | `customer`

This option finds *loyal* customers for each act — those who attended a headline performance in every distinct year that act headlined. Rather than checking each year explicitly, we compare two counts: the distinct years the customer attended that act's headline gigs (`g1`), against the distinct years the act has headlined at all (`g2`). If the counts match, the customer attended every year.

`g1` counts the distinct headline years attended per customer per act, using correlated subqueries referencing the outer aliases:

```sql
SELECT DISTINCT a2.actname, b2.customername, (
    SELECT COUNT(*) 
    FROM (
        SELECT DISTINCT EXTRACT(year FROM max), customername 
        FROM headlines a1 NATURAL JOIN ticket b1 
        WHERE a1.actname=a2.actname AND b1.customername=b2.customername
    ) AS temp5
) 
FROM headlines a2 NATURAL JOIN ticket b2
```

`g2` counts the distinct years each act has headlined — simpler, as it only needs the `headlines` view:

```sql
SELECT DISTINCT b2.actname, (
    SELECT COUNT(*) 
    FROM (
        SELECT DISTINCT EXTRACT(year FROM max) 
        FROM headlines b1 
        WHERE b1.actname=b2.actname
    ) AS temp6
) 
FROM headlines b2
```

The final query `LEFT JOIN`s `g2` onto `g1` on actname where the counts match — the left join preserves acts with no qualifying customers, producing `NULL` values which are replaced with `'[None]'` via `COALESCE`. An invisible column counts total headline appearances per customer for ordering purposes:

```sql
SELECT temp7.actname, temp7.customername 
FROM (
    SELECT 
        g2.actname, 
        COALESCE(customername, '[None]') AS customername, 
        (
            SELECT COUNT(*) 
            FROM headlines NATURAL JOIN ticket 
            WHERE ticket.customername = g1.customername 
            AND headlines.actname = g1.actname
        ) AS invis
    FROM g2 LEFT JOIN g1 ON g1.actname = g2.actname AND g1.count = g2.count
) AS temp7
ORDER BY actname, invis DESC;
```

---

## Option 8

**Input:**
- None

**Output:**
- Table: `venuename` | `actname` | `ticketsrequired`

The final option finds all economically feasible act/venue pairings and the minimum tickets required to achieve that. Economic feasibility is defined as:

$$
\text{average ticket cost} \times \text{capacity of venue} \geq \text{act fee} + \text{venue hire cost}
$$

We first compute a single global average ticket cost across all `GoingAhead` gigs:

```sql
SELECT AVG(cost) INTO average FROM gig JOIN ticket ON gig.gigid=ticket.gigid WHERE gigstatus='GoingAhead';
```

The minimum tickets required is then derived by rearranging as an equality and applying `CEILING`:

$$
\text{minimum tickets} = \left\lceil \frac{\text{act fee} + \text{venue hire cost}}{\text{average ticket cost}} \right\rceil
$$

We use a `CROSS JOIN` of `venue` and `act` to produce every possible pairing, filtering by the feasibility condition:

```sql
SELECT 
    venue.venuename, 
    act.actname, 
    CEILING((act.standardfee+venue.hirecost)/average)::INTEGER AS ticketsrequired 
FROM venue CROSS JOIN act 
WHERE average*(venue.capacity) >= act.standardfee + venue.hirecost 
ORDER BY venuename, ticketsrequired DESC;
```

The `CROSS JOIN` is appropriate here as the question is inherently about all possible combinations, not existing relationships in the data. Results are ordered by venue name, then tickets required descending — so the most accessible pairings appear first within each venue.

---

# Evaluation
Overall this coursework was widely successful, achieving 82%. While there were some improvements that could have been made — for efficiency or cleaner design — it works well in operation. There were some minor issues with working to the specification exactly, such as returning `TIMESTAMP` values instead of `TIME` in option 1, and a bug with `multiGigFailVenues` not being correctly called within `gigCheck()`. The most notable design shortcoming was not fully normalising the `ticket` table, and a missing foreign key constraint between `ticket(gigid, pricetype)` and `gig_ticket(gigid, pricetype)`.

That said, it was a great introduction to the power of databases and how they can be used to efficiently manage and query large amounts of data. The edge cases made working with SQL logic genuinely interesting, and the Java interface gave a much deeper understanding of how SQL is used in practice. Option 2 was by far the most frustrating to implement given the strict and interacting set of constraints, but overall it was an educational and well-crafted coursework that I firmly enjoyed.