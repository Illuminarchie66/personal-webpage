# Introduction
This was the infamous first year coursework that broke many people. What makes this coursework so difficult is the sheer amount you have to do! There are so many functions, so many tests, and so much of it borders on monotinous. Truthfully, I do not remember much about this coursework - I think a mixture of the late nights and the amount of similar work made it all blend together. This review will be a short overview of what was done for this coursework that I can piece together from my notes.

The core of this CW is building components for a website to allow for efficient searching, sorting and accessing data. The module was focused on data structures, and so we had to go and implement our own. We were not allowed to use existing data structures in the Java library. We were tasked with adding to an existing environment, with a focus on completing following classes: `CustomerStore`, `FavouriteStore` and `RestaurantStore`. 

**CustomerStore**
The CustomerStore class will be used to store all the customers in the form of Customer
objects. This class helps with
• Retrieving customer information
• Listing customers sorted by name and their ID
• Searching for customers

**FavouriteStore**
The FavouriteStore class will be used to store all the favourites from the customers
in the form of Favourite objects. This class helps with:
• Retrieving favourite information for restaurants and customers
• Comparing favourites between customers
• Listing most favourited restaurants and which customers favourite the most

**RestaurantStore**
The RestaurantStore class will be used to store all the restaurants in the form of
Restaurant objects. This class helps with:
• Retrieving restaurant information
• Listing restaurants sorted by name, date established and rating
• Find the closest restaurants to a given location
• Searching for restaurants

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
void deleteKey(E key, Comparator<? super E> comp) //calls delete recursive with the root.
void deleteRecursive(Node root, E key, Comparator<? super E> comp) //recursively iterates through the tree to find the element to delete 'key'.
```

### Hash Map

### Hash Set

### Key Value Entry

### Stack

## Utils
### Sort Methods

### Validation

### Comparators

## Customer Store

## Favourite Store

## Restaurant Store

# Evaluation