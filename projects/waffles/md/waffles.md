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

### Comparators

## Customer Store

## Favourite Store

## Restaurant Store

# Evaluation