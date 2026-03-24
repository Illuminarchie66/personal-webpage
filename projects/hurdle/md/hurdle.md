# Introduction
This was the coursework to my first year module on functional programming! This was a coursework focused around Haskell Wordle, otherwise known as Hurdle. This is a recreation of Wordle in a functional language Haskell. For those unawares, Functional programming languages focus on the application of functions, treating everything as a state that transforms with functions. It is incredibly difficult to do regular programming tasks, like anything with variables or objects, but it becomes alot easier to work with updating elements, states and arrays mathematically. There is a lot more too functional programming, however I do not remember a lot of the maths, so we will relearn as we go. This coursework is a great example of this. It is a step by step implementation of Wordle logic, introducing us to the many facets of the language - except monads. Don't worry, we will get there.

This coursework is setup and run with Haskell Stack. You can actually run the Wordle program, the test suite and the functions I implemented by following the instructions on my [Github page](https://github.com/Illuminarchie66/CS141-Hurdle). This page will meanwhile detail the questions, and the logic used to solve them.

# Questions
### 1. Given an input guess, change it so that it is all upper case. 
This problem was fairly to solve, as it was just turning characters to their uppercase variantsand removing any non alphabetic characters. Hence, we can use two functions; From the Data.Char module we can use isAlpha, which checks if a given character is alphabeticAnd from the same module is the isUpper function, which converts lowercase to uppercase and uppercase to uppercase: 'a' -> 'A' and 'B' -> 'B'. So first we filter out all of the non alphabetic characters such as spaces, commas, exclaimation marks,and so on and so forth. Then we map the toUpper function to every remaining character, producing the normalised form of the string we desired.

```haskell
normalise :: String -> String
normalise x = map toUpper (filter isAlpha x)
```

### 2. A valid guess is a one which appears in `guessList`. 
This was also a simple function to implement, as what it checks is if the normalised formof the input is in the list of guessList. This makes use of the filter function, where it checks that it is not empty when filtering compared to the input. Then it returns the toggled form of the answer as the null function returns true when empty.

```haskell
isValid :: String -> Bool
isValid x = not (null (filter (== normalise x) guessList))
```

### 3. Our program runs a little command line. Specific strings should be treated not as guesses, but as commands.
This is another function that uses the basics of the haskell langauge, using guards to determine which option to take. The function uses a normalised version of the input string to compare against "Letters" and "give up".To see what input it should compare against, since the input is normalised, "LETTERS" and "GIVEUP" are the normalisedversions of the input the function would encounter, so that it can call its associated commands from the other haskell file. If it doesn't correspond to either "LETTERS" or "GIVEUP" it calls another command, passing in the parameter of the normalised version of the input. Guards were used over if statements and other forms of selection as I think they look nicer. 

```haskell
parseCommand :: String -> Command
parseCommand x 
    | normalise x == "LETTERS" = ShowLetters
    | normalise x == "GIVEUP" = GiveUp 
    | otherwise = Guess (normalise x)
```

### 4. Part one of the matching algorithm finds the exact matches. For each position, give back IsExact if the two characters are the same, or IsNotExact if they are different. Implement this using explicit recursion. If you can see a more elegant solution, describe it in your justification.
This problem took a bit more thinking, relying heavily on recursion. Here we take in two strings and thenreturn a list of the type ExactMatch. By defining the head and tail in the input parameters (g and gs/a and as)we can then look at each character in isolation, and determining what we want to add on to the end of the list.If the characters equate each other, then we add an element of the instance IsExact to the list; otherwise it adds an instance of isNotExact, both cases resulting in the calling of the function operating on the tail. Using the '++' operator, which adds to the tail of the list; once the function reaches the end of both stringsonce they have empty tails, the function will return an empty list to append. This breaks the recursion, andallows for the function to return the final list.

```haskell
exactMatches :: String -> String -> [ExactMatch]
exactMatches [] [] = []
exactMatches (g:gs) (a:as)
    | g == a = [IsExact g] ++ exactMatches gs as
    | otherwise = [IsNotExact g] ++ exactMatches gs as  
```

### 5. We want to keep track of the "unused" characters in the answer. First, we use up all of the exact matches. This function takes the exact matches and the answer and gives back all the characters not already exactly matched.
Firstly we define another function that returns something more useful to us, where IsExacttranslates to True, and IsNotExact translates to false; regardless of the character attached, donethrough the use of pattern matching.Then we define another recursive function that defines two possibilities. If the current indexof the list of ExactMatch is for type IsExact (shown by function exactPos) then it will append anempty list to the current list being made, effectively skipping the character. Otherwise it will add the characrer of the string entered, effectively reshaping the string so that there are no charactersthat are exact. It once again makes use of the recursion, defining when both strings reach the end oftheir list to be the end of the list; and when to return the value from the function.

```haskell
exactPos :: ExactMatch -> Bool 
exactPos (IsExact c) = True
exactPos (IsNotExact c) = False

removeExacts :: [ExactMatch] -> String -> String
removeExacts [] [] = []
removeExacts (e:es) (a:as) 
    | exactPos e = [] ++ removeExacts es as
    | otherwise = [a] ++ removeExacts es as
```

### 6. Follow the algorithm in the specification to correctly return the list of character matches, given the result of exactMatches and any unused characters of the answer.
This is arguably the most complex function to deal with, since we are given an awkward form to work with and an interesting set of requirements that we have to work with. Firstly we need to design some prerequesite functions to help. The extractChar function allows us to take the weird type ExactMatch,and gather something useful from it, taking the character using pattern matching, effectively 'extracting'the character. Next we need to remove a single character from a string, however we need to do it such that it onlyremoves the first instance of the character. Hence the way to do this is to do a similar process to theprevious two questions, and traverse a string, until it finds the characters specified, then it will onlyreturn the tail of the list. However we still need to implment a break condition if the original string istraversed too until the end, as the character we wish to remove may not be present in the list, henceavoiding a partially defined function. Now we can combine it all together, and for this we need to think about the three conditions that need to be considered:Firsty there is the Exact condition, in which the answer is exactly equal at a certain index.Next there is a Partial condition, in which the answer contains the character only once (if it contains it more times, it must be dealt with seperately).Finally there is the None case, which is where the character is not contained inside of the answer, excluding exact characters.To combine all of this we need to break each condition into guards. First condition of if it is Exact, it is just checkingif the ExactMatch is exact using the exactPos function from last question. If it is, then it will add Exact to the new list,and add recursively, with the tail of the ExactMatch list. Next, we actually tackle the None case, in which if the ExactMatch value is IsNotExact, we then proceed to check if the answer would beempty if we filter out all characters that aren't the character extracted from the list. Using the familiar null and filter methodsthat we know, we combine these conditions and from it we can deduce that it is a None case, and so we add that to the list, calling thefunction once more. Finally, in the Partial case, we can just say that all other cases are of the Partial type; however this has the caviat that we have to remove that character from the list, otherwise we end up being unable to tell what is an appropriate None case. To do this,when we append the function on to itself through recursion, we change the answer string such that it removes the character usingthe removeItem function that we declared earlier. By doing this, all cases are covered and we get the output wanted.We need to account for some base cases though, in which in the event that we traverse to the end of the ExactMatch list, we returnan empty list. In the event that all letters are removed, then every word is partial, and hence we return that full list.

```haskell
extractChar :: ExactMatch -> Char
extractChar (IsExact c) = c
extractChar (IsNotExact c) = c

removeItem :: Char -> [Char] -> [Char]
removeItem _ [] = []
removeItem x (y:ys) 
    | x == y    = ys
    | otherwise = y : removeItem x ys

getMatches :: [ExactMatch] -> [Char] -> [Match]
getMatches [] _ = []
getMatches _ [] = []
getMatches (e:es) (r:rs) 
    | exactPos e = [Exact] ++ getMatches es (r:rs)
    | not (exactPos e) && (null (filter (== (extractChar e)) (r:rs))) = [None] ++ getMatches es (r:rs)
    | otherwise = [Partial] ++ getMatches es (removeItem (extractChar e) (r:rs))
```

### 7. Write the complete matching algorithm as a composition of the above three functions.
There is very little to justify here; effectively we are making a function that just uses the previous functions that we defined. Using the guide as a basis, where it used 'variables' in the ghci to define what was being determined, I plugged in what was called in those variables into the overall function. This substitution method worked well in orderto get everything in the correct location, even if its not the nicest looking.

```haskell
matchingAlgo :: String -> String -> [Match]
matchingAlgo guess answer = getMatches (exactMatches guess answer) (removeExacts (exactMatches guess answer) answer)
```

### 8. Given a list of candidate words, remove those words which would not have generated the given match based on the guess that was made.
This seemingly difficult task is made quite trivial by using the previous functions. We can do this becauseif we treat each word in a given list as the answer, then only potential answers would share the form that we desire; therefore all we must do is compare the result of the matchingAlgo function with the Match list using every element in the list. This just makes use of filter, passing in the the words from the list, assuming that they are all already normalised.

```haskell
eliminate :: String -> [Match] -> [String] -> [String]
eliminate guess matches list = filter (\word -> matchingAlgo guess word == matches) list
```

### 9. Based on the whole history of the game so far, return only those words from `guessList` which might still be the hidden word.
The penultimate task required an application of applying a function on to the imported guessListmultiple times over. The function should repeat until it reaches the end of the list. This can be achieved by implementing a seperate function which recursively calls itself, traversing through the list by the tail, making use of the fst and snd functions used on the pairs.This gets us the data that we need to eliminate the list, that same list being passed in with all ofthe previous values removed. There are two base cases; when the list of pairs is over, it will just returnthe list it has gotten and if the list is ever empty, it will return an empty list to indicate thatthere are no words that satisfy the conditions given.

```haskell
apply :: [(String, [Match])] -> [String] -> [String]
apply [] list = list
apply _ [] = []
apply (x:xs) list = apply xs (eliminate (fst x) (snd x) list)

eliminateAll :: [(String, [Match])] -> [String]
eliminateAll list = apply list guessList
```

### 10. Using the above functions, write a function which produces a next guess based on the history of the game so far.
Here, I tried a lot of different things, as you will see in the PastAttempts.hs file. The main thoughtprocess that you will see is trying to numerically define the quality of a word. This way a word could beorganised and sorted, in to a way that is useful too us. However, as the deadline approached, it becamemore and more unattainable, and it reaches a point where you are driven to utter insanity and desperation.So, from my findings from the fittingly released 3blue1brown videos, SALET appears to be the best starting wordfor reasons delved in to in the PastAttempts.hs. Once this word is chosen, then we work down the number of wordsand proceed to take the head of the eliminateAll list. It is far from optimal, averaging at roughly 4.9 guesses, but there was an effort made to try and formulate a good solution; to see those solutions and the explainationslook in the PastAttempts.hs file.

When looking at how wordle should be played, my first thought was in how to determine each word to have a comparable numerical value, one that can be easily sorted by the sortOn function built into Haskell. My first thoughtin how to measure the effectiveness of a word was to look at the number of words in guessList that contained a character.This ignored multiple characters, and using the function contains, looks to see if the character appears once in a word, if it reaches the end of the string without finding it, it returns false. This method was then used to filter the list given to numOfAppearances, in which it would then find the length of that list, showing how many words were containedin the list provided. Then the onAll function would bee used to get a list of tuples containing a character, and the numberof words that character appears in. This function effectively returns a data structure that then can be scoured to find the valueof a certain character. This followws such that we have a function of value which returns the lookup of the character entered,and inbuilt function that makes use of Maybe where it is either in the list (Just) or it is not in the list (Nothing). Once we can get the value of an individual character, I found the value of a word in wordRanking, which was just the addition of all of the value of the characters in the given string. Finally this was re-applied to all words in a list with the function of listRanking,producing a list of tuples of strings and their integer values. This now means we can use sortOn snd, where it would sort from least to greatest based on the second value in each tuple. By taking the last of this list (and then taking the fst of the tuple returned),we get a string that should theoretically return the best word! Yet, this has quite a few flaws. This is flawed as firstly it doesn'tconsider the position of the character; secondly it doesn't consider what multiple characters imply, and so it didn't give very goodword suggestions. As the character that appears in the most words is 'S', words with 3 'S' characters were selected, which wasn'tgreat for finding multiple characters; even increasing the average number of guesses.

After my first failed attempt, I began to consider what it meant to have a series of two good guesses. If the first two guesses covered the largest span of words possible, then it would mean that it would eliminate the largestamount of words. This was attempted with the two diversify functions, in which it makes use of the contains functionfrom my last attempt. In the first function, it takes the previous guess made, and it goes through every character in the word given. If the character is contained in the previous guess, then the numerical value is incremented. This continues until reaching the end of the word. Then in the following function it proceeds to apply this to all words in a given string. The given list can be sorted like above, and instead we take the head, giving a word that has characterscompletely unique to the previous guess. This one also failed, as it also did not consider the position of the charactersas well as ignoring the frequency and appearance of certain characters, effectively picking at random from a more diverse word set.

It was only here - getting an epiphany in the shower - that I realised my mistake of not considering the position ofthe characters in the words, and it began to click a bit more. Firstly I designed a function that would extract anelement from a list by a given index, making the list more like an array (whilst ineffecient, I was desperate). From hereI proceeded to make it a general function, such that it could be reused in the program for not just strings. Following this I designed a similar function, that effectively checked against the a given index; whilst this wasn't necessaryto have its own function, it was useful for the clarity of defining functions. Then, doing a similar solution as to my first attemptin which the number of times a character appears at an index is found out with numOfAppearAtIndex; which would scan a list to see howmany words started with character A for example. Then what followed was four onAllX functions, which were iterations of the same thingtrying to make a list in a useful form. The first two worked in conjunction to produce a list of lists, where each list was in referenceto each index; taking the form [[('A', 737), ('B',...),...],...] that first list being the number of words that started with each character. The second two made a more useful form of a list of tuples, where the tuples contained a list; taking the form:[('A', [737, 231,...]), ('B', [...]),...], which was more useful as we could then lookup a character, and use the extractByIndex functiononce more to extract the value that we wanted. This culminated in the rankAlgo which took a word, and looked up the values that it wanted from the previous result, effectively calculatingthe numerical value of the word. This then was combined into the listRanking2 function, which created a ranking of the list given using the rankAlgoand then we would get a list we could use once more. Then we use the same operations from the first attempt, of sorting and going to the last value, and theoretically it should have been one that is a better guess. This one... is also flawed. Firstly, whilst it now accounts for theposition of the characters in the word, and the frequency of appearances, it fails to not only be relative to the list, but it also failsto account for mutliple letters. This is seen by the letter S getting massive favorability again, to the point it was not useful. Additionally,its a really slow design, not optimised in the slightest.

It was at this point I had given up, I didn't think I could find a solution that would be worth spending ages on. So, I finallywent an watched the 3blue1brown video. This perfectly timed upload was one I had been avoiding as not only was everyone watching it,but it also felt like cheating, as it seemed to propose a blatant algorithm to solve it. The solution and reasoning behind it thoughwas worth the watch, simply due to the interesting mathematics covered. The method makes use of a concept known as entropy, in which it uses an effective probability distribution function, to go and map the effects of each case. By passing in the differentcases of wordle: using None, Partial and Exact; we can see the liklihood of each given a certain word. This probability functionwill vbe known as p. This uses our matchingAlgo from before, using each word in the list as the the set of data across which weare finding the probability. With this function, we then want to find the entropy of a guess, which can be done by considering negative log base 2 of the probability. The justification behind this lies in the idea of cutting the number of guesses in halfeach time (the video explains the concept a lot better than I ever could). With this entropy formula in hand though, I could nowwrite out the entropy function. The sum of -p(x)*log_{2}(p(x)) is the entropy. For the 0 case, we can use some simple properties of limitsand L'Hospital's rule to find that when p(x) -> 0, entropy will tend toward 0. Therefore with this, we have our entropy function. This function should give the worthiness of a word, where the greater the value of entropy implies a greater chance of the word giving us useful information. Now if we apply the entropy equation on to all of the words in the guessList using the eTest functionwe can get our final answer of.... Nothing! The function is too slow to be useful, likely taking upwards of hours to go through it all. This is very much due to the poorly written entropy function, perhaps the matchingAlgo function also playing a part into it. There are small adjustments I could make to be sure, such as rearranging the entropy equation to reduce the number of divisions, findingmore constant values; or perhaps improving the matchingAlgo so that it takes less time. However... I couldn't find any improvementthat would improve the speed enough to be useful. If it were to be applied to a guess, we would sort the list for the highets entropy,and that word should be the value that we want, but since it is too long to be useful, we use the findings that "SALET" is the bestword to select. Whilst this outcome is disappointing, the exploration of the ideas here was definitly interesting.

https://www.youtube.com/watch?v=fRed0Xmc2Wg

# Evaluation