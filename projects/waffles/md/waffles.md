# Introduction
This was the infamous first year coursework that broke many people. What makes this coursework so difficult is the sheer amount you have to do! There are so many functions, so many tests, and so much of it borders on monotinous. Truthfully, I do not remember much about this coursework - I think a mixture of the late nights and the amount of similar work made it all blend together. This review will be a short overview of what was done for this coursework that I can piece together from my notes.

The core of this CW is building components for a website to allow for efficient searching, sorting and accessing data. The module was focused on data structures, and so we had to go and implement our own. We were not allowed to use existing data structures in the Java library. We were tasked with adding to an existing environment, with a focus on completing following classes: `CustomerStore`, `FavouriteStore` and `RestaurantStore`. 

**CustomerStore** <br>
The CustomerStore class will be used to store all the customers in the form of Customer
objects. This class helps with
- Retrieving customer information
- Listing customers sorted by name and their ID
- Searching for customers

**FavouriteStore** <br>
The FavouriteStore class will be used to store all the favourites from the customers
in the form of Favourite objects. This class helps with:
- Retrieving favourite information for restaurants and customers
- Comparing favourites between customers
- Listing most favourited restaurants and which customers favourite the most

**RestaurantStore** <br>
The RestaurantStore class will be used to store all the restaurants in the form of
Restaurant objects. This class helps with:
- Retrieving restaurant information
- Listing restaurants sorted by name, date established and rating
- Find the closest restaurants to a given location
- Searching for restaurants

Each store has a list of functions that we go to complete. I will say in advance, I did not complete all functions. 

# Tasks
For this coursework, it effectively reduced to creating the best most space and time effecient functions for different classes, whilst implementing in our own data structures. We will detail the datastructures we made, and each of the functions and their time complexity and method. 

## Data Strcutures
We had to implement every data structure ourselves, which meant we sometimes implemented them not-optimally. However, it was a good way to learn many of them and their applications. All of them used Java's generics, as to work with any data and comparator we provided.

### Array List
Yes, we were not allowed to use existing ArrayList data structures. We could only use arrays. We had to implement it from the ground up. This first data structure was simple, having implemented it in labs. It is a dynamic data structure, with simple functions that perform as expected:
```java
void increaseSize() : //recreates the array to be twice as large, with capacity of 1000 items.
boolean add(E element) : //adds element to the array, returns true on success. Doubles array size when capacity is reached.
boolean add(E element, int index) : //adds element to the array at specific index specified. If something already exists there it overwrites it.
boolean contains(E element) : //performs linear search to check if the array contains given element, returns true if it contains it.
void clear() //creates new array, emptying current object of all values.
boolean isEmpty() //returns true if empty, false if not.
int size() //returns the number of elements in the array.
E get(int index) //returns element from the given index in the array.
E set(int index, E element) //replaces given idnex with element, and returns prior element from given index.
int indexOf(E element) //returns index of element if it exists in the array, else -1. Returns index of first appearance if there are multiple.
boolean remove(E element) //removes first element that matches given. Returns true if element removed from array. Removes first appearance if there are multiple.
boolean removeByIndex(E element) //removes element that is at given index. Returns true if element removed from array.
String toString() //writes the array as a string.
E[] toArray() //returns the ArrayList as an array.
```

### Binary Search Tree
This data structure was a very important one for searching, inserting and deleting effeciently. Elements are stored in a sorted, hierarchical way so that those operations are effecient. Take a binary tree: values on the left subtree are smaller; values on the right subtree are larger. The order is defined by a comparator. This allows for $O(\log n)$ insert, search and delete. However, it is important to note that we only implemented a regular BST, which is not self balancing. This means that depending on order that it is inserted, it can result in trees with very deep branches, effectively turning it to a linked list with complexity of $O(n)$. I did not feel like implementing an AVL or Red-Black tree at the time, I was out clubbing for the majority of this coursework. 
```java
void deleteKey(E key, Comparator<? super E> comp) //calls deleteRecursive with the root.
void deleteRecursive(Node root, E key, Comparator<? super E> comp) //recursively iterates through the tree to find the element to delete 'key'.
E min() //recursively iterates through to the left of the tree to find smallest value.
void insert(E key, Comparator<? super E> comp) //calls insertRecursive with the element to insert.
Node insertRecursive(Node root, E key, Comparator<? super E> comp) //recursively iterates through to the correct position of the new element and inserts the key.
void inorder() //calls inorderRecursive to output the tree in order.
void inorderRecursive(Node root) //recursively iterates over the tree with left, output node, right.
boolean search(E key, Comparator<? super E> comp) //calls searchRecursive and returns true if element exists in the tree.
Node searchRecurisve(Node root, E key, Comparator<? super E> comp) //recursively iterates through the tree to fidn the element to return it is found.
int size() //calls size(root), returns number of elements in tree.
int size(Node node) //recursively iterates through the tree, incrementing at each element.
E[] toArray(Class<?> classTemp) //calls toArrayRecursive and returns array of elements in order.
int toArrayRecursive(Node root, E[] array, int i) //recursively iterates over the tree with left, add to array, right.
```

### Hash Map
A hashmap has a key of type `K` map to a value of type `E` and is accessed in $O(1)$ time. We do this by instantiating a bucket which uses an ArrayList. We use a hash function to map the key to an integer value, which can then pull from the array instantly. We use a bucket so that if there is a collision, it will just have a chain of values, which it does a linear search to find the matching key associated. 

```java
int getHash(K key) //computes hash of key with object's hashcode, makes it positive with logical AND, then takes the modulus of the value wrt the capacity, so it maps to an index in the array block.
KVEntry getEntry(K key) //computes the hash of the key, then iterates over the bucket until it finds the key. 
void put(K key, V value) //if key exists, it updates the existing value. Else it creates the hash, maps a bucket to the hash and adds an entry.
V get(K key) //if the key exists, it gets the value, else returns null.
boolean contains(K key) //checks if the bucket linked to the hash is not null, and that the key exists in the bucket.
void delete(K key) //if the key exists, it computes the hash and removes the entry from the bucket.
int size() //returns the number of elements in the hashmap.
boolean isEmpty() //returns if the number of elements is 0.
```

### Hash Set
This extends a hashmap, but instead of having values, it just maps to an empty object `PRESENT`. Therefore it has the same implementation (it uses the hashmap in its definition).

```java
void add(E e) //adds element to set.
void remove(E e) //removes element from set.
boolean isEmpty() //returns if number of elements is 0.
boolean contains(E e) //checks if the set contains element.
```

### Stack
This uses an ArrayList, by defining an ArrayList and a `top`. We increment the top when we add to the ArrayList, and when we pop or peek we use the `top` as our index. Popping has us decrement `top` as well. 

```java
void push(E elem) //adds element to stack and increments top.
E pop() //if list not empty, returns the element at top and decrements. Else returns null.
E peek() //if list is not empty, returns the element at the top. Else returns null.
int size() //returns number of elements in the stack.
boolean isEmpty() //returns if the number of elements is 0.
```

## Utils
Alongside our data structures, we needed several utilities, which included sorting methods, validators and comparators. 

### Sort Methods
We needed to implement ways to sort a list. We did this with both quick sort and merge sort, so we could use whichever performed better. Quick sort partitions the array into low and high, and recursively performs the partition on smaller and smaller segments. Meanwhile, merge sort, recursively splits the array in half, and rebuilds the array in the correct order. We found that quick sort was generally better (and properly implemented), as well as having much better space complexity. However, if we were to go back, a bucket sort would be a better implementation. 

```java
void swap(T[] arr, int i, int j) //swaps values at index i and j in array arr.
int partition(T[] arr, int low, int high, Comparator<? super T> comp) //swaps elements which are greater than the pivot and those less than the pivot, so everything below the pivot is less than the pivot, and everything above the pivot is greater than the pivot. 
void quickSort(T[] arr, int low, int high, Comparator<? super T> comp) //recursively calls partition, with each side of the list.
void merge(T[] arr, T[] left, T[] right, int l, int r, Comparator<? super T> comp, Class<T> clazz) //merges arrays left and right in order.
void mergeSort(T[] arr, int n, Comparator<? super T> comp, Class<T> clazz) //repeatedly divides the array, before reconstructing with merge.
```

### Validation
There are several functions that act as additional util throughout the program. The majority of them check the validity of data entry, to filter out the invalid objects. They follow a series of convoluted and silly restrictions imposed for the sake of artifical challenge!

```java
extractTrueID(String[] repeatedID) //of an array of length 3, returns the ID which appears 2 or more times.
isValid(Long inputID) //checks that there are no 0 digits, and that there are no digits that do not appear consecutively more than 3 times.
isValid(Customer customer) //checks the customer has an ID, first name, last name, date joined and has a valid ID.
isValid(Restaurant restaurant) //checks the restaurant has a name, owner first name, owner last name, cuisine, establishment type, price range, date established, last inspected date. Checks the restaurant does not contain "2 The" in the name. Checks the restaurant has a food inspection rating in the range (0,5), warwick stars in (0,3), and customer rating in (1, 5). Checks the date established is before the last inspection.
isValid(Favourite favourite) //checks the favourite has an ID, the customer has an ID, restaurant has an ID, has a date favourited, and has a valid customer and restaurant. 
convertAccents(String str) //converts accented letter to regular Ascii with a hashmap. 
```

### Comparators
We needed many custom comparators to compare our objects together in different ways. The majority was just simple comparaisons between numerical values.

```java
DateFavouriteComparator //orders favourites by the most recent date made
DateRestaurantComparator //orders restaurants by most recent date of establishment
IDCustomerComparator //orders customers by ID
IDFavouriteComparator //orders favourite by ID
IDRestaurantComparator //orders restaurant by ID
NameCustomerComparator //orders customers by first name then last name lexicographically
NameRestaurantComparator //orders restaurants by name lexicographically
RatingRestaurantComparator //orders restaurants by customer rating
ResrtaurantDistanceComparator //orders restaurants by haversine distance
StarRestaurantComparator //orders restaurants by warwick stars
```

## Customer Store
This was the storage to hold and retrieve information about customers. 
### Space complexity
- `customerHash` Hashmap: Long to Customer. Hashes customerID to customer object. $O(n)$
- `customerIDs` BST: Customer. Stores and orders customers by their ID. $O(n)$
- `customerNames` BST: Customer. Stores and orders customers by their name(lexiographically). $O(n)$
- `IDblacklist` Hashset: Long. Stores blacklisted IDs. $O(k)$
Therefore average space complexity of $O(n)$ as $ n >> k$.

### Time complexity
#### addCustomer(Customer c)
This adds a customer object to all data stores if it is valid. This results in a total time complexity of $O(h)$, where $h$ is the height of the BST (since it is not self balancing).

#### addCustomer(Customer[] c)
This adds a list of customers with $m$ items to all data stores by iteratively calling `addCustomer()`. Therefore it has time complexity of $O(\sum_{i=1}^m h_i)$, based on the tree height.

#### getCustomer(Long id)
Retrieves the customer with the ID given. Takes $O(1)$ as we use the `customerHash`.

#### getCustomers()
This retrieves an array of customer objects, in order of ID. We do this in $O(n)$ with an inorder traversal implemented into the ID BST.

#### getCustomers(Customer[] c)
We are given an array of customers, and are to order them by ID. We do this by creating a tree, inserting everything, and turning the array into a tree, so $O(\sum_{i=1}^m h_i)$. In hindsight we should have just used a sort with our comparators.

#### getCustomersByName()
This retrieves an array of customer objects, in order of name. We do this in $O(n)$ with an inorder traversal implemented into the name BST.

#### getCustomersByName(Customer[] c)
We are given an array of customers, and are to order them by name. We do this by creating a tree, inserting everything, and turning the array into a tree, so $O(\sum_{i=1}^m h_i)$. In hindsight we should have just used a sort with our comparators.

#### getCustomersContaining(String s)
We are to return a array of customers in order with the search string appearing in either first or last name. We do this by recursively iterating over the name BST, adding to a list of customers we convert at the end. We also convert the strings to remove accents using a hashmap. This gives us $O(n(a+b) + \sum_{i=1}^m h_i)$, where $a$ is number of average letters in string to convert accent, and $b$ is complexity to check contains of a string. 

## Restaurant Store
This is a simple and logical extension of CustomerStore, with more BSTs for ordering. While it had more features for hashmaps for util, it mostly followed up from the materials in Customer Store.

### Space complexity
- `restaurantHash` Hashmap: Long to Restaurant. Hashes restaurantID to restaurant object. $O(n)$
- `restaurantIDs` BST: Restaurant. Stores and orders restaurants by their ID. $O(n)$
- `restaurantNames` BST: Restaurant. Stores and orders restaurants by their name. $O(n)$
- `restaurantDates` BST: Restaurant. Stores and orders restaurants by their date established. $O(n)$
- `restaurantStars` BST: Restaurant. Stores and orders restaurants by the number of Warwick Stars. $O(n)$
- `restaurantRatings` BST: Restaurant. Stores and orders restaurants by customer ratings. $O(n)$
- `IDblacklist` Hashet: Long. Stores blacklisted IDs. $O(k)$
Therefore average space complexity of $O(n)$ as $n >> k$

### Time complexity
#### addRestaurant(Restaurant r)
This adds a restaurant object to all data stores if it is valid. We check validity with $O(1)$ operation. This results in a total time complexity of $O(h)$, where $h$ is the height of the deepest BST (since it is not self balancing).

#### addRestaurant(Restaurant[] r)
This adds a list of restaurant with $m$ items to all data stores by iteratively calling `addRestaurant()`. Therefore it has time complexity of $O(\sum_{i=1}^m h_i)$, based on the tree height.

#### getRestaurant(Long id)
We use the restaurantHash to check if ID is contained in the dataset, and if so we return the object in $O(1)$.

#### getRestaurants()
This retrieves an array of restaurant objects, in order of ID. We do this in $O(n)$ with an inorder traversal implemented into the ID BST.

#### getRestaurants(Restaurant[] r)
We are given an array of restaurants, and are to order them by ID. We do this by creating a tree, inserting everything, and turning the array into a tree, so $O(\sum_{i=1}^m h_i)$. In hindsight we should have just used a sort with our comparators.

#### getRestaurantByName()
This retrieves an array of restaurant objects, in order of name. We do this in $O(n)$ with an inorder traversal implemented into the name BST.

#### getRestaurantsByDateEstablished()
This retrieves an array of restaurant objects, in order of date established. We do this in $O(n)$ with an inorder traversal implemented into the date BST.

#### getRestaurantsByWarwickStars()
This retrieves an array of restaurant objects, in order of Warwick stars. We do this in $O(n)$ with an inorder traversal implemented into the stars BST. This is why we have so many very similar BSTs. 

#### getRestaurantsByRating(Restaurants[] r)
We are given an array of restaurants, and are to order them by rating. We do this by creating a tree, inserting everything, and turning the array into a tree, so $O(\sum_{i=1}^m h_i)$. In hindsight we should have just used a sort with our comparators.

#### getRestaurantsByDistanceFrom(float latitude, float longitude)
This retrieves an array of restaurant objects, in order of distance established from given latitude and longitude. We do this by creating a tree, inserting everything as distance objects, and turning the array into a tree, so $O(\sum_{i=1}^m h_i)$. We use the haversine formula, as our mechanism for our compatator.

#### getRestaurantsByDistanceFrom(Restaurant[] r, float latitude, float longitude)
We are given an array of restaurants, and are to order them by distance from given latitude and longitude. We do this by creating a tree, inserting everything as distance objects, and turning the array into a tree, so $O(\sum_{i=1}^m h_i)$. We use the haversine formula, as our mechanism for our compatator.

#### getRestaurantsContaining(String searchTerm)
Here we break down the contains function to checking if it has a name match, cuisine match or place match. We create a temporary tree and iterate over the BST, putting matches into the tree so we return them in order with $O(n(b+h))$.

## Favourite Store
This was the storage to hold and retrieve data about customer's favourited restraunts. This had much more complex functions to create. 

### Space complexity
- `favouriteArray` ArrayList: Favourite. Used to find favourites which shares CustomerIDs and RestaurantIDs. $O(n)$
- `favouriteHash` Hashmap: Long to Favourite. Hashes favouriteID to favourite object. $O(n)$
- `favouriteIDs` BST: Favourite. Stores and orders favourites by their ID. $O(n)$
- `favouriteCustomers` Hashmap: Long to BST (Favourite). Stores favourites and their customers with respect to customerID order. $O(nm)$
- `favouriteRestaurant` Hashmap: Long to BST (Favourite). Stores favourites and their restaurants with respect to restaurantID order. $O(nm)$
- `customerToCount` Hashmap: ID to Integer. Counts number of customers that have favourited something. 
- `restaurantToCount` Hashmap: ID to Integer. Counts number of restaurant that have been favourited. 
Therefore average space complexity of $O(nm)$ where $m$ is the tree with largest number of nodes.

### Time complexity
#### addFavourite(Favourite f)
We first check if the favourite is valid in $O(1)$, and check the blacklist in $O(1)$. We cycle through the array to find favourites with customerID and restaurantID being identical, taking $O(n)$. If there is a value with the same IDs, we check which favourite is the latest. If the current favourite is later, we add it to the blacklist; else we add the container to the blacklist and update the stores. This results in a time complexity of $O(n+h)$ where $h$ is the height of the deepest BST.   

#### addFavourite(Favourite[] f)
This adds a list of favourite with $m$ items to all data stores by iteratively calling `addFavourite()`. Therefore it has time complexity of $O(mn + \sum_{i=1}^m h_i)$, based on the tree height.

#### getFavourite(Long id)
We use the favouriteHash to check if ID is contained in the dataset, and if so we return the object in $O(1)$.

#### getFavourites()
This retrieves an array of favourite objects, in order of ID. We do this in $O(n)$ with an inorder traversal implemented into the ID BST. (I promise it now gets more interesting).

#### getFavouritesByCustomerID(Long id)
We get the binary tree from the long ID that is in `favouriteCustomer` in $O(1)$ and iterate over the tree inorder to get the list of customers in $O(n)$.

#### getFavouriteByRestaurantID(Long id)
We get the binary tree from the long ID that is in `favouriteRestaurant` in $O(1)$ and iterate over the tree inorder to get the list of restaurants in $O(n)$.

#### getCommonFavouriteRestaurants(Long id1, Long id2)
This finds restaurants in common between two customers with ID1 and ID2. We do this by converting the tree of customers from ID2 into a hashmap of RestaurantIDs to the favourite through a recursive `getHashMap()` function, taking $O(m)$. Then it recursively traverses through the tree of customers from ID1 to see what RestaurantIDs are contained in the newly constructed hashmap, taking $O(n)$. Finally we convert the  subsequent tree into an array, which has final size $k$. Thus it takes $O(n+m+k)$, where $n$ is size of tree from ID1, $m$ is size of tree from ID2 and $k$ is number of shared elements.

#### getMissingFavouriteRestaurants(Long id1, Long id2)
This finds the restaurants that are favourited by customer with ID1 but not customer with ID2. We convert the tree of customers from ID2 int oa hashmap of RestaurantIDs to the favourite with `getHashMap()`. Recusrively traverses through tree of customers from ID1 to see what restaurant IDs are contained in newly constructed hashmap. Similar process to getting common, but we instead exclude when reconstructing the tree, where $k$ is number of elements they do not share for time complexity $O(n+m+k)$.

#### getNotCommonFavouriteRestaurants(Long id1, Long id2)
This finds the restaurants that customer with ID1 favourites but ID2 doesn't, and customer ID2 favourites, but ID1 doesn't. This was a set symmetric differnce operator; so we know that difference of sets QA and B is equal to the set difference of the union of A and B and the intersection of A and B. Since we developed a set difference function with `getMissingFavouriteRestaurants()`, we just get the union and intersections easily, by recursing over the respective trees with $n$ and $m$ elements. Then we find the set difference, ending with $O(n+m+k+l)$ like before, but with $l$ representing the number of elements in the final tree we convert. these set operations could have been done better with a TreeSet, but we were not bothered to create this.

#### getTopCustomersByFavouriteCount()
This gets the top 20 customers who favourited the most, in order of who favourited the most. We go through each entry in `favouriteCustomers` and insert each key into a tree, along with the associated count from `customersToCount`. This gives us a tree we can take the top 20 elements of and we get our solution, thus $O(n + \sum_{i=1}^n h_i)$.

#### getTopRestaurantsByFavouriteCount()
This gets the top 20 restaurants who favourited the most, in order of most favourited. We go through each entry in `favouriteRestaurants` and insert each key into a tree, along with the associated count from `restaurantsToCount`. This gives us a tree we can take the top 20 elements of and we get our solution, thus $O(m +\sum_{i=1}^m h_i)$.

# Evaluation
This coursework is LONG. Its a bad coursework lets be real. It removes a lot of thinking for annoying minutia with comparators and complexities, and does not explore what makes a great relevant data structure - other than that most of the time a self balancing sorted tree is good. There were some interesting possibilities, using TreeSets with the Favourite questions, but the effort to implement and test was not worth the marks, and so I settled for mediocrity here. The time commitment of this coursework and stress related to it cannot be emphasised enough, however it does provide good experience of a full interactive infrastructure that may be used - it is just quite intense for a coursework.

Looking back at it now, it still has a lot of flaws, and my solution has even more. However, there were interesting problems posed, and it forced us to think about the balance between time and space complexity. While I do not intend on revisiting this ever, it was fundamental in getting me started in thinking about the asymptotic implications of algorithms, that were crucial going forward.