# Introduction
Formal Languages module was a study of the theory behind programming languages, presenting classification with Chomsky hierarchy, techniques for identifying languages (closure properties, pumping lemmas) and automata models. Additionally looking at context-free languages, grammars, normal forms, lexical analysis and parsing, etc. This was a deep and complex theoretical module, and this coursework was not. 

We were tasked with building a parser and interpreter for a simple functional language called PL, using JavaCC (Java Compiler Compiler) - a parser generation tool. This takes a grammar file `.jj`, and produces a working lexer and parser from it. We define the grammar declaratively and JavaCC handles the mechanics. Our grammar is include on this webpage. The output of a valid PLM program is either a computed integer, or the word `DIVERGENCE`, which is where function calls recurse infinitely. Invalid programs produce `FAIL` alongside a line number and a description of what went wrong.

We had to implement the language, parsing valid PLM programs and outputting `PASS`. We must also detect and report errors with the correct line number and description. We also must have correct evaluation, correctly calling recursive/mutually recursive functions that diverge to print `DIVERGENCE`, otherwise correctly evaluating the expression.

# Language
PLM is a minimal and purely functional language. Each program is a series of named functions, followed by a single `MAIN` entry point. We have no conditionals, no loops, just functions, integers, addition and multiplication. Our keywords are all capitalised, and each line must end with a semicolon. An example program may look like this:
```
DEF DOUBLE x { x + x } ;
DEF SQUARE x { x * x } ;
MAIN { SQUARE(DOUBLE(2) + 3) } ;
```
Each function takes exactly one parameters, and functions can call other functions by passing an expression as an argument. `MAIN` must take no parameters, and is the only function that gets evaluated. So for the example above, we evaluate: `SQUARE(DOUBLE(2) + 3) = SQUARE(4+3) = SQUARE(7) = 49`. The grammar enforces multiplication to take priority, matching standard arithmetic. We also need to enforce whitespace, with one space exactly between tokens in a definition. This is quite strict, but makes writing token rules simple.

We also had to enforce that several other conditions:
- `MAIN` is defined exactly once
- Function names must be unique
- `DEF` cannot be used as a function name, as it is a reserved key word
- Any function that is called must be defined somewhere in the program
- `MAIN` cannot be called from within another function
- Parameters used inside a function body must match the functions declared parameter name exactly 

# Implementation

## Recognition and Error Reporting
The first task was correctly accepting valid PLM programs, and rejecting invalid ones with a meaningful error message with the correct line number. JavaCC makes grammar structure straightforward to express in the more theoretical way. We first define a series of tokens that will be identified using regex:
```java
TOKEN: 
{ 
  "(" | ")" | "+" | "*" | "{" | "}" | ";" 
  | <DEF: "DEF"> 
  | <MAIN: "MAIN">
  | <EOL: "\n">
  | <SPACE: " ">
  | <NUM: (["0"-"9"])+> 
  | <FUNCNAME: (["A"-"Z"])+> 
  | <PARAM: (["a"-"z"])+> 
}
```
We first define the top level rule `S`, which sets the `lineNum` to be 1, and we look for the start of the code. It expects one or more `DEF` lines, followed by the end of file `<EOF>`. Each time there is another set of `DEF` and a new line, we increment the `lineNum`. Each line is parsed by rule `P`, which handles both regular functions and `MAIN`. Into the expression we pass in the name of the function, the parameter name and a boolean to track if the function is main. We maintain a set of function names called `Functions` which is used to check if there is more than one `MAIN` and if there are any duplicate function names. The expressions are split across 3 rules: `E`, `T` and `F` - following the standard pattern for encoding operator precedence into a grammar. `E` handles addition, `T` handles multiplication and `F` handles the base cases: number, function call or parameter.
```java
void S():
{
  Errors.lineNum=1;
}
{
  (<DEF> <SPACE> P() {Errors.lineNum++;})+ <EOF>
}
```

We do addition and multiplication by converting into postfix, adding the operator to the array `postfix`. We call addition,  then multiplication, then the base cases:
```java
void E(String f, String p, boolean m): {} { 
    T(f, p, m) ("+" T(f, p, m) {
        Functions.getFunc(f).postfix.add("+");
    })*      
} 

void T(String f, String p, boolean m): {} { 
    F(f, p, m) ("*" F(f, p, m) {
        Functions.getFunc(f).postfix.add("*");
    })*      
}

void F(String f, String p, boolean m): //...
```
`F` is where it gets a bit more complex, being the bottom of the grammar, where if it is a number it adds it raw to `postfix`. If it is a function, it adds it to a map of called functions and to `postfix` (as well as checking `MAIN` is not called). If it is a parameter, it checks if we are in main, and if it is we fail, otherwise it checks that the parameter name matches the definition, and adds it to `postfix`.
```java
void F(String f, String p, boolean m): 
{
  String param;
  String funcName;
} 
{ 
  <NUM> {String num = token.image;}
  {
    Functions.getFunc(f).postfix.add(num);
  }
  | <FUNCNAME> {funcName = token.image;} "(" E(f, p, m) ")" 
  {
    Functions.addCalled(funcName, Errors.lineNum);
    Functions.getFunc(f).postfix.add(funcName);
    
    if (funcName.equals("MAIN")) {
      Errors.custom(Errors.lineNum);
      throw new ParseException("MAIN function cannot be called.");
    } 
  }
  | <PARAM> {param = token.image;} {Functions.getFunc(f).postfix.add(param);}
  {
    if (m) {
      // main function
      if (param != null){
        Errors.custom(Errors.lineNum);
        throw new ParseException("No parameters allowed in main functions.");
      }
    } else {
      if (!param.equals(p)) {
        Errors.custom(Errors.lineNum);
        throw new ParseException("Parameter symbol " + param + " not found.");
      } 
    }
  }
}
```
All of this combined, allows for the grammar to be implemented by JavaCC, handling the majority of the logic enforcing token orders and grammar rules.

## Expression Evaluation
The second task was ensuring we implemented evaluating the `MAIN` expression and printing the result. During parsing, we don't evaluate immediately and instead convert to a postfix notation list. Operators and function names are pushed onto the list after their operands, which makes evaluation straightforward using a stack, without any need to track priority at runtime. The algorithm for our `evaluate` function goes like so:
1. We define an empty stack
2. We iterate over the expression `postfix`
3. If it is numerical or a parameter , we push onto the stack
4. If addition or multiplication, we pop off the stack twice and apply the operation
5. If it is a function, we recursively call `evaluate`, passing in the passed value, the name of the function and the associated expression
6. Eventually the stack empties and we result in a value
Since this is performed after parsing, we know the inputs are exactly what they are intended to be, so if we encounter an exception ,it is because it has reached a recursive depth limit from functions repeatedly calling each other and looping. Hence, we catch the looping values and are able to determine the divergence. We do this by taking advantage of Java's call stack throwing a `StackOverflowError` when a recursive loop is deep enough - rather than analytically detecting cycles.

It is worth noting this abides by the specification, but is not optimal as not all loops are divergent. For example, if a loop repeatedly just multiplies by 1, it converges to a value. But we only track when a loop occurs and report it as divergence. In retrospect, it would be better to use a hashset, to see if a function has been encoutnered before when going down an evaluation chain, but for the purposes of this coursework this approach worked well. 

# Evaluation
This coursework was short but sweet! I got to use various techniques for parsing, and because the specification was so well laid out, it meant that I could design the programs and algorithms to handle each of the specific cases. It was definitely needed as I really flopped on other parts of this module. In my marks break down I achieved 92% on recognition, 100% on evaluation, and 92% on error identification. Documentation was also full marks. The missed 8% on recognition and error identification points to one or two edge cases not handled quite right. 

If I were revisiting this, I would add more systematic test cases around the error paths early on - particularly around line number accuracy for multi-line programs and the ordering of checks when multiple errors could apply simultaneously. The custom error system worked well in practice but was bolted on rather than designed from the start, which made it harder to reason about edge cases later. 