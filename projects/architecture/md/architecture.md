This was the two courseworks for the Computer Organisation and Architecture module in my first year of university. This had a fun mix of theory and programming questions focused on computer memory, binary, and how a computer system works. For this retrospective, I will briefly detail each of the questions and what was required of me and the basic solution ! However, you can read the full coursework PDF attached on this page. Additionally, check out the GitHub for the code itself, and a guide for how to run the code.

# Coursework 1
## Question 1: Active low 8-to-3 encoder
This question was focused on a 8-to-3 encoder. An encoder takes $2^n$ possible inputs and translates it into $n$ outputs. In particular it was an active low encoder, which means that what would typically be 1s would be 0. So this means that we look at 0s as the active value. most encoders follow the priority rule, where the highest index takes precedence, so if $I_4$ and $I_3$ re active, we get the value mapped for $I_4$; but we didn't use that, as that introduces complex masking. 
### Truthtable:
| I7 | I6 | I5 | I4 | I3 | I2 | I1 | I0 | | Y2 | Y1 | Y0 |
|----|----|----|----|----|----|----|----|-|----|----|----|
| 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | | 0 | 0 | 0 |
| 1 | 1 | 1 | 1 | 1 | 1 | 0 | 1 | | 0 | 0 | 1 |
| 1 | 1 | 1 | 1 | 1 | 0 | 1 | 1 | | 0 | 1 | 0 |
| 1 | 1 | 1 | 1 | 0 | 1 | 1 | 1 | | 0 | 1 | 1 |
| 1 | 1 | 1 | 0 | 1 | 1 | 1 | 1 | | 1 | 0 | 0 |
| 1 | 1 | 0 | 1 | 1 | 1 | 1 | 1 | | 1 | 0 | 1 |
| 1 | 0 | 1 | 1 | 1 | 1 | 1 | 1 | | 1 | 1 | 0 |
| 0 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | | 1 | 1 | 1 |

### Boolean function
If we were to try to simplify with the truthtable, we get this:
$$
\begin{aligned} 
Y_2 &\equiv (I_0 I_1 I_2 ... \bar{I_7}) + (I_0 I_1 ... \bar{I_6} I_7) + (I_0 ... \bar{I_5}... I_7) + (I_0 ... \bar{I_4}...I_7) \\\\
&\equiv I_0 I_1 I_2 I_3 (I_4 I_5 I_6 \bar{I_7} + I_4 I_5 \bar{I_6} I_7 + ...) \\\\
&\equiv I_0 I_1 I_2 I_3 (I_5 I_6 (\bar{I_4} I_7 + I_4 \bar{I_7}) + I_4 I_7 (\bar{I_5} I_6 + I_5 \bar{I_6})) 
\end{aligned}
$$
And just for $Y_2$. No, there was a better way. Proof by inspection! By tracing the table where the outputs are $1$, and following to which input is 'active' a series of or statements can connect all of the inputs, resulting in these three solutions for the circuits:
$$
\begin{aligned}
Y_2 \equiv \bar{I_7} + \bar{I_6} + \bar{I_5} + \bar{I_4} \\\\
Y_1 \equiv \bar{I_7} + \bar{I_6} + \bar{I_3} + \bar{I_2} \\\\
Y_0 \equiv \bar{I_7} + \bar{I_5} + \bar{I_3} + \bar{I_1} 
\end{aligned}
$$

### Logic circuit with only NOR gates
![NOR Gate Logic Circuit](./architecture/md/images/encoder1.png)
*Active Low 3-to-1 Encoder Diagram*

![NOR Gate Logic Circuit Optimised](./architecture/md/images/encoder2.png)
*Active Low 3-to-1 Encoder Diagram Optimised*

## Question 2: Bidirectional shift register
This question focused on shift registers! An $n$-bit register uses D-type flip flops to store binary values, which is updated by an impulse clock. Making it a shift register means that as the value is updated, it shifts over to the next register. Making it bidirectional means that a value controls which way it points. Also, it is worth adding that it is a serial register we are designing.

### Design a serial 4-bit bidirectional shift register 
The idea is that we have $\text{right entry} = R$, $\text{left entry} = L$, $\text{output} = Q$ and $\text{mode} = m$. So when $m=0 \implies Q=L$ and $m=1 \implies Q=R$, which we can expand into a truthtable.

| m | R | L | | Q |
|---|---|---|-|---|
| 0 | 0 | 0 | | 0 |
| 0 | 0 | 1 | | 1 |
| 0 | 1 | 0 | | 0 |
| 0 | 1 | 1 | | 1 |
| 1 | 0 | 0 | | 0 |
| 1 | 0 | 1 | | 0 |
| 1 | 1 | 0 | | 1 |
| 1 | 1 | 1 | | 1 |

With this we can find the equation we use for the design.
$$
\begin{aligned}
Q &= (\bar{m} \land \bar{R} \land L) \lor (\bar{m} \land R \land L) \lor (m \land R \land \bar{L}) \lor (m \land R \land L) \\\\
&= {\color{red}{(m \land R \land \bar{L}) \lor (m \land R \land L)}} \lor {\color{blue}{(\bar{m} \land \bar{R} \land L) \lor (\bar{m} \land R \land L)}} \\\\
&= {\color{red}{(m \land R) \land (\bar{L} \lor L)}} \lor {\color{blue}{(\bar{m} \land L) \land (\bar{R} \lor R)}} \\\\
&= {\color{red}{(m \land R)}} \lor {\color{blue}{(\bar{m} \land L)}}
\end{aligned}
$$

![Logic Diagram of the Shift Register](./architecture/md/images/shift1.png)
*Logic Diagram of the Shift Register*

As it must be a serial-serial register, we need it to have a single input and single output; so $L$ and $R$ must be the same. 

![Logic Diagram of the Shift Register serial-serial](./architecture/md/images/shift2.png)
*Logic Diagram of the Shift Register serial-serial*

### Design a parallel n-bit bidirectional shift register
When considering an N-bit PIPO register, we see that each flip flop takes in a single input, and return out a single output. We use two mode inputs $m_1, m_2$ for right shift, left shift and parallel load. If we refer back to our previous strategy, we need to effectively create a sub-circuit that takes in the inputs of the two modes, the parallel load, the shift right load, and the shift left load. However, we also need one other load, and that is what is in the current register, as if we have a 0,0 mode case, then we want to feed that back in. Drawing this
out, we have a truth table that is 7 x 64, which is too much to work with. and if we try to do expressions, we get 32 terms which is still quite heavy. So instead we use multiplexers. We map $m_1, m_2$ to the following table:

| $m_1$ | $m_2$ | Q |
|---|---|---|
| 0 | 0 | C |
| 0 | 1 | R |
| 1 | 0 | L |
| 1 | 1 | P |

This operates exactly like a multiplexer with those 6 inputs. The multiplexer equation is:
$$Q = (C \land \overline{m_1} \land \overline{m_2}) \lor (R \land \overline{m_1} \land m_2) \lor (L \land m+1 \land \overline{m_2}) \lor (P \land m_1 \land m_2)$$
Which gives us this final circuit:

![Logic Diagram of the n-bit shift register parallel-parallel](./architecture/md/images/shift3.png)
*Logic Diagram of the n-bit Shift Register parallel-parallel*

## Question 3: Circuit simplification
This was taking a boolean function and simplifying it in various different methods. 
$$F = A.B + \bar{A}.B.\bar{C}.D + \bar{A}.B.C.D + A.\bar{B}.\bar{C}.\bar{D}$$

### Karnaugh map
$$F = \color{red}{(B \land D)} \lor \color{green}{(A \land B)} \lor \color{green}{(A \land \bar{C} \land \bar{D})}$$

![Karnaugh map](./architecture/md/images/karnaugh.png)
*Karnaugh map*

### Boolean algebra 
$$
\begin{aligned}
F &= (A \land B) \lor (\bar{A} \land B \land \bar{C} \land D) \lor (\bar{A} \land B \land C \land D) \lor (A \land \bar{B} \land \bar{C} \land \bar{D}) \\\\
&= {\color{red}{(\bar{A} \land B \land \bar{C} \land D) \lor (\bar{A} \land B \land C \land D)}} \lor (A \land \bar{B} \land \bar{C} \land \bar{D}) \lor (A \land B) \\\\
&= {\color{red}{\bar{A} \land ((B \land \bar{C} \land D) \lor (B \land C \land D))}} \lor (A \land \bar{B} \land \bar{C} \land \bar{D}) \lor (A \land B) \\\\
&= {\color{red}{\bar{A} \land ({\color{blue}{(B \land D) \land \bar{C} \lor (B \land D) \land C}})}} \lor (A \land \bar{B} \land \bar{C} \land \bar{D}) \lor (A \land B) \\\\
&= {\color{red}{\bar{A} \land ({\color{blue}{(B \land D) \land (\bar{C} \lor C)}})}} \lor (A \land \bar{B} \land \bar{C} \land \bar{D}) \lor (A \land B) \\\\
&= {\color{red}{\bar{A} \land ({\color{blue}{(B \land D) \land 1}})}} \lor (A \land \bar{B} \land \bar{C} \land \bar{D}) \lor (A \land B) \\\\
&= {\color{red}{(\bar{A} \land B \land D) }}\lor (A \land \bar{B} \land \bar{C} \land \bar{D}) \lor (A \land B) \\\\
&= {\color{red}{(\bar{A} \land B \land D) \lor (A \land B)}} \lor (A \land \bar{B} \land \bar{C} \land \bar{D}) \\\\
&= {\color{red}{B \land ({\color{blue}{(\bar{A} \land D) \lor A}})}} \lor (A \land \bar{B} \land \bar{C} \land \bar{D}) \\\\
&= {\color{red}{B \land ({\color{blue}{((\bar{A} \lor A) \land (D \lor A))}})}} \lor (A \land \bar{B} \land \bar{C} \land \bar{D}) \\\\
&= {\color{red}{B \land ({\color{blue}{(1 \land (D \lor A))}})}} \lor (A \land \bar{B} \land \bar{C} \land \bar{D}) \\\\
&= {\color{red}{B \land ({\color{blue}{D \lor A}})}} \lor (A \land \bar{B} \land \bar{C} \land \bar{D}) \\\\
&= {\color{red}{(B \land D) \lor (A \land B)}} \lor (A \land \bar{B} \land \bar{C} \land \bar{D}) \\\\
&= {\color{green}{(A \land B) \lor (A \land \bar{B} \land \bar{C} \land \bar{D})}} \lor (B \land D) \\\\
&= {\color{green}{A \land (B \lor (\bar{B} \land \bar{C} \land \bar{D}))}} \lor (B \land D) \\\\
&= {\color{green}{A \land ({\color{blue}{(B \lor \bar{B}) \land (B \lor (\bar{C} \land \bar{D}))}})}} \lor (B \land D) \\\\
&= {\color{green}{A \land ({\color{blue}{1 \land (B \lor (\bar{C} \land \bar{D}))}})}} \lor (B \land D) \\\\
&= {\color{green}{A \land ({\color{blue}{B \lor (\bar{C} \land \bar{D})}})}} \lor (B \land D) \\\\
&= {\color{green}{(A \land B) \lor (A \land \bar{C} \land \bar{D})}} \lor (B \land D) \\\\
&= (B \land D) \lor (A \land B) \lor (A \land \bar{C} \land \bar{D}) 
\end{aligned}
$$

### NAND Logic Circuit 
We now need to turn the simplified circuit into a circuit using only 2 input NAND gates.

![NAND Gate Logic Circuit](./architecture/md/images/nand1.png)
*NAND Gate Simplification*

![NOR Gate Logic Circuit Optimised](./architecture/md/images/nand2.png)
*NAND Gate Simplification Optimised*

## Question 4: C programming
Final question for the first coursework was to create some simple C programs. Pointers are the worst ya'll.

### GCD 
**Write a C program that implements the GCD algorithm. Your program should provide feedback on what calculations are being performed and show a correct result. You should ensure your program is well documented and any error cases are handled appropriately. Clearly state any assumptions.**

The basic algorithm pseudocode is very simple to implement with Euclid's algorithm. 
```
while (b ! = 0) do
    if (a > b) then
        a = a -b
    else
        b = b -a
    end
end
return a
```

However, I was interested by the domain that GCD applied. Was GCD limited to only positive integers? Before doing the interesting mathematics, we first needed to implement the basic algorithm. We could either do it recursively or using a while loop:
```c
int GCD_while(int num1, int num2) {
    while (num2 != 0) {
        int temp = num2;
        num2 = num1 % num2;
        num1 = temp;
    }
    return num1;
}

int GCD_recusive(int num1, int num2) {
    if (num2 == 0) {
        return num1;
    } else {
        return GCD_recursive(num2, num1 % num2);
    }
}
```
Both functions use the same logic, but the while loop method is much better. This is because recursion logic continually adds to the stack the new data values before it can pop them all off at the end; whereas the while loop just updates existing memory values. Therefore it is more memory efficient, so we use this. 

For validation, we have to implement the check that it only accepts positive integers. To check for an invalid input we can use:
```c
(scanf("%d%c", &num1, &enter) != 2 || enter != '\n')
```
If this is true, then the input gathered by `scanf` is not an integer. This isn't perfect as it does not account for size limits, as an overflow will occur if the value exceeds 2147483647, so it will become negative if it becomes after this. 

We also need to consider $0$ as an input. If we enter $0$ into the program we see that $\text{gcd}(0,a) = \text{gcd}(a,0) = a$; but is this actually correct? The GCD of a pair of numbers, is the greatest number that divides both of them (giving an integer output). For $0, a$, if we say $0$ is an integer, then $0$ divided by anything is $0$, hence will always give an integer regardless of GCD. Therefore, we only need the greatest divider of $a$, which will always be $a$. Next is the issue of $\text{gcd}(0,0)$, as with the previous logic it would equal $0$. But this brings about the question of $0/0$, which is undefined and a poor solution, thus not generating an integer. As previously stated, $0/a=0$, so regardless of how large $a$ is, an integer will always be produced, so we should take the greatest divisor of the other number. But if that is also the case for the other number, that means we want the highest value of $a$ possible. Therefore, it continually grows so $\text{gcd}(0,0) \rightarrow \infty$. Apparently though, $\text{gcd}(0,0) = 0$, which is more of a convention than a definition, so that GCD can maintain certain properties, such as $m \text{gcd}(a,b) = \text{gcd}(am,bm)$.

We then were curious to extend the domain of the code. Firstly, we extended from positive numbers to include all positive and negative integers as this identity holds:
$$\text{gcd}(x,y) = \text{gcd}(x,-y) = \text{gcd}(-x,y) = \text{gcd}(-x,-y)$$
Which is equivalent to saying:
$$\text{gcd}(x,y) = \text{gcd}(|x|,|y|)$$
Which we prove: (Note $x\backslash y$ states that $y$ is divisible by $x$)
$$
\begin{aligned}
& \text{Suppose } u\backslash a \\\\
\implies & \exists q : a = qu \\\\
\therefore & -u\backslash a \implies a = (-q)(-u) \text{ and } u\backslash -a \implies -a = (-q)u
\end{aligned}
$$
This tells us that every divisor or $a$ is a divisor of both positive and negative $a$, so every divisor of $a$ is a divisor of $|a|$. Hence it follows that any common divisor between $x$ and $y$, is a common divisor of $|x|$ and $|y|$. As GCD is the greatest common divisor, and all common divisors are shown to hold for positive and negative integers, we can conclude $\text{gcd}(x,y) = \text{gcd}(|x|,|y|)$. This changes the program little, as we now only pass in the absolute value of `num1` and `num2`. This was enough to create our final program:

```c
#include <stdio.h>
#include <stdlib.h>

int GCD(int num1, int num2){
  while (num2 != 0){ /* This code segment will repeat until num2 equals 0 */
    int temp = num2; /* A temporary variable is used to store num2, so num2 can be set to something new and can still be used after */
    num2 = num1 % num2; /* This takes num1 mod num2, where x mod y gives the remainder of x divided by y */
    num1 = temp; /* Sets num1 to num2 for the next cycle */
  }
  return num1; /* Upon return, num1 will be the gcd of the original inputs into the function */
}

int main(){
  int num1;
  int num2;
  char enter;
  char enter2;

  printf("Enter num1: \n");
  if (scanf("%d%c", &num1, &enter) != 2 || enter != '\n') /* Takes an integer input to be num1, and checks that after the int, the character is only enter */
  {
    printf("Invalid input \n"); /* This ends the program, and outputs there is an invalid input to the user. */
  }
  else {
    printf("Enter num2: \n");
    if (scanf("%d%c", &num2, &enter2) != 2 || enter2 != '\n') /* Takes an integer input to be num2, and checks that after the int, the character is only enter */
    {
      printf("Invalid input \n"); /* This ends the program, and outputs there is an invalid input to the user. */
    }
    else {
      printf("GCD of %d and %d is %d \n", num1, num2, GCD(abs(num1), abs(num2))); /* This will print the value of the GCD of num1 and num2, passing in the absolute value to account for all cases of negative numbers */
    }
  }

}
```

Whilst the program is complete, it still doesn’t alleviate my curiosity of non-integer GCD. Getting it to work for negative numbers was a nice extension to working values, however I make the far more ambitious claim that you can take the GCD of any two numbers in the set of rational numbers. The GCD of two numbers comes from the prime numbers. The fundamental theorem of arithmetic explains how any number can be expressed as a product of primes. We can more formally represent a number $n$ like so:
$$n = 2^{n_2} \cdot 3^{n_3} \cdot 5^{n_5} \cdot 7^{n_7} \cdot ... = {\displaystyle \prod_{p \: primes}^{\infty} p^{n_p}}$$
All values that are not used are just 0. We can use this to find:
$$\text{gcd}(a,b) = \prod_{p \: primes}^{\infty} p^{\min(a_p, b_p)}$$
With this formula, we can use this to extend the definition of GCD. When we look at a rational number, we express it in the form $m/n : n,m \in \mathbb{Z}$. 
$$
\begin{aligned}
a &= \frac{m}{n}: n,m \in \mathbb{Z} \\\\
&= \frac{2^{m_2} \: \cdot \: 3^{m_3} \: \cdot \: 5^{m_5} \: \cdot ...}{2^{n_2} \: \cdot 3^{n_3} \: \cdot \: 5^{n_5} \: \cdot ...} \\\\
&= \frac{2^{m_2}}{2^{n_2}} \cdot \frac{3^{m_3}}{3^{n_3}} \cdot \frac{5^{m_5}}{5^{n_5}} \cdot ... \\\\
&= 2^{m_2 - n_2} \cdot 3^{m_3 - n_3} \cdot ... \\\\
&= {\displaystyle \prod_{p}^{\infty} p^{m_p - n_p}}
\end{aligned}
$$
Therefore, all rational numbers can be expressed as a multiplication of primes. The only difference is that the exponents may not be positive integers. This lets us conclude: $\forall x \in \mathbb{Q}, x_p = m_p - n_p: x = \frac{m}{n}, m,n \in \mathbb{Z}$. And so, the GCD of any two rational numbers can be found! For an example we will find:
$$
\begin{aligned}
\text{gcd}\left(\frac{8}{9}, 12\right) &= \text{gcd}(2^3 \cdot 3^{-2}, 2^2 \cdot 3^1) \\\\
&= 2^{\min{(3, 2)}} \cdot 3^{\min{(-2, 1)}} = 2^2 \cdot 3^{-2} = \frac{4}{9}
\end{aligned}
$$
While this seems unintuitive, it does seem to work with examples, as dividing by the solution given gives an integer output. I did not get chance to rigorously prove this, and is a pattern case that is difficult to be tested. Implementing this is very difficult to do, especially in C, as it requires a dynamic data structure. Its also very difficult to perform prime factorisation (shocker), so if we were to do this, we would need a better approach.  

We can go and perform a proof that:
$$\text{gcd}(\frac{a_1}{a_2}, \frac{b_1}{b_2}) = \frac{\text{gcd}(a_1, b_1)}{\text{lcm}(a_2, b_2)}, a_1, a_2, b_1, b_2 \in \mathbb{Z}$$
Proof: to be completed later. 

We also can go and prove:
$$\text{gcd}(a,b) \cdot \text{lcm}(a,b) = |ab|$$
Proof:
$$
\begin{aligned}
v_p(\text{gcd}(a,b)) &= \min(v_p(a), v_p(b)) \\\\
v_p(\text{lcm}(a,b)) &= \max(v_p(a), v_p(b)) \\\\
v_p(\text{gcd}(a,b) \cdot \text{lcm}(a,b)) &= v_p (\text{gcd}(a,b) + \text{lcm}(a,b)) \\\\
&= \min(v_p(a), v_p(b)) + \max(v_p(a), v_p(b)) \\\\
&= v_p(a) + v_p(b) \: \left(\text{note:} \min(x,y) + \max(x,y) = x+y\right) \\\\
&= v_p(ab)
\end{aligned}
$$
Since two rationals are equal if they have the same prime exponents:
$$
\text{gcd}(a,b) \cdot \text{lcm}(a,b) = ab
$$
And since GCD and LCM are defined to be positive, 
$$
\text{gcd}(a,b) \cdot \text{lcm}(a,b) = |ab|
$$

Therefore, we can find the $\text{gcd}(a_1,b_1)$ and $\text{gcd}(a_2,b_2)$, which we can find quickly using Euclid's algorithm. Then:
$$
\text{gcd}(\frac{a_1}{a_2}, \frac{b_1}{b_2}) = \frac{\text{gcd}(a_1, b_1)}{\text{lcm}(a_2, b_2)} = \text{gcd}(a_1, b_1) \cdot \frac{\text{gcd}(a_2, b_2)}{|ab|}
$$

So this algorithmically finds the GCD of any two rational numbers quickly! 

### Signed binary sum
**Write a C program that calculates the sum of two 8-bit binary strings represented in sign-magnitude, printing the result of the calculation in two’s complement. You should assume that both inputs are null-terminated. Your program should provide feedback on what calculations are being performed and show a correct result. You should ensure your program is well documented and any error cases are handled appropriately. Clearly state any assumptions.**

For this one it was alot simpler as there was less room for experimentation. I could solve it with two possible methods:
1. I could convert the two sign and magnitude inputs into denary, then add them using C’s addition, and then convert back into two’s complement’s form, outputting that to the user.
2. I could convert the two sign and magnitude inputs into two’s complement form, and then perform binary addition on the two binary strings, outputting that to the user.

They both work, but method 2 requires less operations and method 1 is simpler to implement. We chose to implement method 1 as it better handles issues with overflow. We then broke this down into 3 functions: `toDenary()`, `toBinary()` and `validation()`.

`toDenary()` takes a string of length 8, and outputs an integer. We write the input as $[A_0, A_1, \dots, A_7]$, and find denary given sign and magnitude:
$$\text{denary} = (-1)^{A_0} \cdot \left(\sum_{i=1}^7 A_i \cdot 2^{7-i} \right)$$
Implemented here:
```c
int toDenary(char bin[]) 
{
  int i;
  int denary = 0;
  for (i = 1; i < 8; ++i) 
  {
    int num = bin[i] - '0'; 
    denary = denary + num * power(2, 7-i); 
  }
  int sign = bin[0] - '0'; 
  denary = denary * power(-1, sign); 
  return denary;
}
```

`toBinary()` takes an integer value that can be positive or negative, and finds the binary string in two's complement.
```c
const char* toBinary(int den) 
{
  int i;
  char* bin = malloc(sizeof(char) * 9); 
  for (i = 7; i >= 0; --i) 
  {
    if ((den - power(2,i)) < 0) 
    {
      bin[7-i] = '0'; 
    } else { 
      bin[7-i] = '1'; 
      den = den - power(2, i); 
    }
  }
  bin[8] = '\0'; 
  return bin;
}
```

`validation()` finally checks that the binary inputs from the user. It checks that the length is 8, all the values in the string are 0 or 1, and checks for all white spaces.
```c
int validation(char bin[]) 
{
  if (strlen(bin) == 8) 
  {
    int i;
    for (i = 0; i < 8; ++i) 
    {
      if ((bin[i] != '1' && bin[i] != '0') || bin[i] == ' ') 
      {
        return 0; 
      }
    }
    return 1; 
  } else {
    return 0;  
  }
}
```

Finally, we can use these functions for the full program. We take in the inputs from the user, validating each of them. We then convert the values to denary before adding them. If the sum is less than 0, we find the binary of the sum plus 256 as the first value must be 1. Otherwise, we can calculate binary as usual. 
```c
int main()
{
    char bin1[8];
    char bin2[8];

    printf("Enter first binary value: \n");
    scanf("%s", bin1); 
    if (validation(bin1) == 0){
      return 0; 
    }
    int val1 = toDenary(bin1); 
    printf("= %d \n", val1); 

    printf("Enter second binary value: \n");
    scanf("%s", bin2); 
    if (validation(bin2) == 0){
      return 0; 
    }
    int val2 = toDenary(bin2);  
    printf("= %d \n", val2); 

    int sum = val1 + val2;
    printf("%d + %d = %d \n", val1, val2, sum);
    if (sum < 0) 
    {
      sum = sum + 256; 
      printf("= 1%s \n", toBinary(sum)); 
    } else { 
      printf("= 0%s \n", toBinary(sum)); 
    }

    return 0;
}
```

# Coursework 2
## Powerset
**Write a program that takes a set S as input and outputs the powerset of S. You should ensure that your program is well documented and any error cases are handled appropriately. Clearly state any assumptions**

This program was simple, breaking down into 3 core steps:
1. Entering the inital set.
2. Validating the initially entered set.
3. Systematically going through the set to output the powerset.

Sets differ from arrays as sets are unordered, and there can be no repeating elements. This creates the problem that there is nothing stopping the user from entering the same element into a set multiple times. We prevent this by performing a linear search on an array as we increment over it, and remove the latest element if a repeat is found. (Hi! Future Archie here, I was a lazy dummy who did not want to implement a hashset in C). 
```c
char** getSet(int size)
{
  int i;
  int j;

  char **arr;

  arr = malloc(size * sizeof(char*));
  for (int i = 0; i < size; i++){
    arr[i] = malloc((20) * sizeof(char));
  }

  printf("Enter %d elements:\n",size);
  for (i=0; i<size; ++i){
		scanf("%s",&arr[i]);
    int found = 0;
    char* curr = arr[i];
    for (j=0; j<i; j++){
      char* temp = arr[j];
      if (temp == curr){
        found = found + 1;
      }
    }
    if (found > 0){
      printf("There cannot be repeats of elements, enter another one:\n");
      i = i-1;
    }
	}

  return arr;
}
```

With a valid array that has qualities of a set, we perform a powerset algorithm, which uses binary to track and iterate over every possible combination of a powerset. Alternatively we could use recursion, but once again the recursion stack is very limited, especially with C memory. 
```c
char **set = getSet(set_size);
powerset_size = power(2, set_size);
for (index=1; index<powerset_size; index++) {
    for (i=0; i<set_size; i++) {
        if ((index & (1 << i)) > 0) {
            printf("%s", &set[i]);
        }
    }
}
```
This results in a pretty awful time complexity of $O(n2^n)$, but it can be shown that any algorithm that outputs the full powerset must take at least $\Omega(n 2^n)$, so it cannot be asymptoptically beaten. This is just for outputting it though, if we wanted to use powerset, we can approach $O(2^n)$ by using the binary code increment. 

I will also add that I got a bit math bored when doing this coursework, and wanted to approximate how long it would take for a set with $n$ elements. So I graphed the number of elements in the set against the time it took, and use linear least squares to find the a formula for time. 
$$
\begin{aligned}
&t = an2^{bn} \\\\
\implies & \ln(t) = \ln a + \ln n + bn\ln 2 \\\\
\implies & \ln(\frac{t}{n}) = \ln a + (b \ln 2) n \\\\
\implies & y = c+dn
\end{aligned}
$$
This gives us:
$$a\approx 4.4885\times 10^{-8}, b\approx 0.9982$$
So, if we wanted to find out how many elements it would take for the program to run for at least a day, we can solve with the lambert W function:
$$
\begin{aligned}
& 86400 \approx 4.4885\times 10^{-8} \cdot x2^{0.9982 x} \\\\
\implies & 1.9249 \times 10^{12} = xe^{0.9982 \ln 2 x} \\\\
\implies & 1.9249 \times 10^{12} \cdot 0.9982 \ln 2 = 0.9982 \ln 2 x e^{0.9982 \ln 2 x} \\\\
\implies & W(1.3319 \times 10^{12}) = W(0.9982 \ln 2 x e^{0.9982 \ln 2 x}) \\\\
\implies & 24.7104 = 0.9982 \ln 2 x \\\\
\implies & 35.7139 = x \\\\
\implies & x \approx = 36 
\end{aligned}
$$
Thus it will take a set of 36 elements to have the program run for a day! Fun! 

## Text editor
**The C programming language allows for us to easily work with files. In this question you will implement a command-line editor that is capable of creating, displaying and manipulating text files. You have a lot of freedom in how you do this but you will need to make informed design decisions and provide justifications for these choices as part of your documentation.** 

**Write a C program that allows a user to perform each of the operations listed below on text files. You must provide a command-line interface and operate on files in your current working directory but, apart from these requirements, you may implement the program in any way. You should document all design decisions not covered above, e.g., how a user specifies the operation they want to perform.**

This was a large task, requiring us to implement several functions:
```
createFile():
    • Parameters:
        – char* name: name of text file
    • Processes:
        1. Create an empty file with the name specified.
copyFile():
    • Parameters:
        – char* copying: name of text file being copied
        – char* name: name of the new text file
    • Processes:
        1. Create an empty file with the name specified.
        2. Copies content from the original file to new file.
deleteFile():
    • Parameters:
        – char* name: name of text file
    • Processes:
        1. Delete text file specified.
showFile():
    • Parameters:
        – char* name: name of text file
    • Processes:
    1. Find the content in the text file specified.
    2. Output the content to the user.
appendLine():
    • Parameters:
        – char* name: name of text file
        – char* text: input that user wants to append
    • Processes:
        1. Traverse to the end of the text file specified.
        2. Add the input as a line of text.
deleteLine():
    • Parameters:
        – char* name: name of text file
        – int line: line of text user wants deleted
    • Processes:
        1. Create an empty file with the name of the original.
        2. Copy each line of content from the original until the specified line is reached.
        3. Iterate through the line, then copy the rest of the file.
        4. Delete the original file.
insertLine():
    • Parameters:
        – char* name: name of text file
        – int line: line that the user wants to insert text
        – char* text: input that user wants to insert
    • Processes:
        1. Create an empty file with the name of the original.
        2. Copy each line of content from the original until the specified line is reached.
        3. Append the string inputted for that line.
        4. Copy the rest of the file.
        5. Delete the original file.
showLine():
    • Parameters:
        – char* name: name of text file
        – int line: line of text user wants shown
    • Processes:
        1. Traverse to the line of the text file specified.
        2. Traverse through the line, and output the string.
showLineNum():
    • Parameters:
        – char* name: name of text file
    • Processes:
        1. Traverse to the end of each line, and increment a counter.
        2. Output the counter.
```

Now truthfully, this is not a very interesting coursework for the most part. The majority of it is just working with C syntax and file manipulation. You can view the code for each function in the [GitHub repo](https://github.com/Illuminarchie66/CS132-Computer-Architecture/blob/main/CW2/texteditor.c), but I won't detail each one of them here. The next step once each function was implemented was to build an interactive CLI interface for the user, allowing them to enter commands. The user will be able to input a command, and if it matches any listed in the help message, it will perform the command. Additionally, we then fun a function which adds the command to what the user just ran to a changelog. The largest limitation with my code is the poor use of memory allocation; due to my poor skill with C. "Whenever malloc gets involved, so do segmentation faults". Instead of focusing on the uninteresting standard implementations for those file operations, I will focus on what I did for part b!

**Also, Implement two additional operations or extensions to the operations listed above. You should provide justifications for the usefulness of the functionalities you introduce.**

Here I considered a bunch of possible functions that I could implement, and their pros and cons.
```
Find: Enters a text file and attempts to locate a specified string, returning word position, and line it is on.
    + Useful function to the user, letting them find different instances of text.
    + Has room to include more detail, and for it to be expanded on.
    - Requires a lot of string manipulation.
    - Relatively uninteresting to implement.
Evaluate Line: This function would locate a line in a file, and if it is a mathematical expression, then it will evaluate it to the correct expression.
    + Very interesting idea, requiring more than just string manipulation.
    + Has room to be expanded upon, adding additional functions and functionality to it.
    + Can be useful if the user has equations wanting to be solved.
    - String manipulation to error check.
    - Very specific usage.
Encryption: Encodes the data of a text file with an option of ciphers and encryption methods.
    + Useful to the user, as it allows for data to be effectively protected, as if it had a password.
    + Has a lot of room for expansion, using various ciphers: Vigen`ere, Caeser, Binary/Morse/OtherBases, even some own custom made.
    - Requires a lot of string manipulation, and a good understanding of each cipher.
    - User could forget passcode, and then we would really be screwed.
    - Would only be single key authentication, two factor is too difficult for C.
Undo/Redo: It undos and redos... I really do not know how else to describe it.
    + Most useful feature, how many times have we accidentally deleted a file that we didn’t want too?
    + Is complex and interesting to design.
    - Is complex and difficult to design.
    - Requires a detailed changelog.
Directory commands: This implements the commands to create, move to and delete directories as well as text files.
    + Useful feature for creating a more interactive command line.
    - Requires a strong understanding of linux, bash and how all the commands work.
    - Pushes away from the focus of a text editor.
Noughts and Crosses: Creates a text file with a board; then either two players or a single player against a bot can play noughts and crosses by specifying position in command line (could also work for battle-ships).
    + Useful for if the user or Matt (our lecturer) gets bored whilst marking.
    + Level of complexity from updating the file and the difficulty of the bot.
    - Really is not that useful to this being a text editor.
Command line functions: commands like clear (refresh command line), list (list off text files in directory), etc.
    + Incredibly useful for me, this series of utility commands would have made my whole life so much easier.
    + Likely would also make the user’s life greater as well.
    - Could be incredibly simple dependent on inbuilt commands.
```

Originally I considered doing undo and redo, as this is the most undoubtedly useful function here. The way I would do this is looking at a stack, I would pop off the function and the parameters, and it would do the inverse. So `rename(name, newname)` is undone by `rename(newname, name)` for example. However, while near every function has a nice easy inverse, the only exception is `deleteFile`, as I did not have a good storage solution. We would have to store whole text files that were deleted in some cache so they could be undone, which could become difficult. So, I decided not to do this, and instead do: list files, and evaluate line. 

List files was done as it is just a very useful command that lists all text files in a directory. This was quite simple, and done mostly because I was low on time for this coursework. It iterates over all files in the directory that ends in `.txt` and outputs the name and number of lines of the file.

Evaluate line was done as I wanted to explore how calculators, programming languages and interpreters parse mathematical terms. So I set out to implement a parser which finds numerical solutions to problems involving addition, subtraction, multiplication and division. We implemented the Shunting Yard algorithm, which aims to make exressions that are infix notation, and transforms them into postfix. 
1. We define `priority(operator)` which determines which operators take precedence (think bidmas).
2. We define `apply(x,y,operator)` which carries out the operation on x and y.
3. We define `update(values, ops)` which updates the values stack of an operation.
4. To evaluate, we traverse through the expression given:
    - If the character is a white space, we ignore and move on.
    - If the character is an opening bracket `(`, we push it to the operation stack.
    - If the character is a digit:
        * Traverse the list until it has the full base 10 numerical value.
        * Push the value on to the value stack.
    - If the character is a closing bracket `)`:
        * Performs all operations in the brackets, using `update` to push to value stack.
        * Pop values stack.
    - If the character is an operator:
        * Performs all operations of greatest priority, using update to push to value stack.
        * Pushes the operation on to the value stack.
5. Traverse to the next character.
6. Once fully traversed, updates the value stack until there are no more operators.
7. Return the top of the value stack. 

We implement this method with:
```c
double evaluate(char* expression)
{
  double* values = malloc(100 * sizeof(double));
  int valTop = -1;
  /* Defines a stack of doubles called values, where empty: top = -1 */

  char* ops = malloc(100 * sizeof(char));
  int opsTop = -1;
  /* Defines a stack of characters called ops, where empty: top = -1 */

  int i = 0;
  /* Position of the expression */
  int neg = 0;
  /* Negative number flag */
  int size = strlen(expression);

  while (i < size)
  /* Traverses through all elements of the expression */
  {
    if (expression[i] == '('){
      ops[++opsTop] = expression[i];
      /* Pushes an opening brace to the ops stack, indicating the start of an expression */
      if (expression[i+1] == '-'){
        /* Checks if the negative flag needs to be set */
        neg = 1;
        i = i + 1;
        /* Sets the negative flag, and increments past the negative sign */
      }
    } else if (isdigit(expression[i])){
      /* Character is a digit, a numerical value */
      double val = 0;
      int decimal = 0;
      while (i < size && (isdigit(expression[i]) || expression[i] == '.'))
      /* Continues to iterate until reaching the end, or reaching a character that is not a digit or a '.' */
      {
        if (expression[i] == '.'){
          /* Tracks whether values need to be divided by 10, rather than multiplied */
          decimal = decimal+1;
          /* Stores the exponent to raise the divisor by */
        } else {
          char digit[2];
          digit[1] = '\0';
          digit[0] = expression[i];
          /* Converts the charatcer into a string, so atof can be used on it */

          if (decimal == 0){
            /* Not reached a decimal point yet */
            val = val * 10 + atof(digit);
            /* Converts number to numerical form for C */
          } else {
            /* Has reached a decimal point */
            double divisor = power(10, decimal);
            val = val + (atof(digit)/divisor);
            decimal = decimal + 1;
            /* Converts number to numerical floating point form for C */
          }
        }
        i = i + 1;
        /* Traverses the expression until reaching a non digit or '.' character */
      }

      if (neg == 1){
        /* negative flag is true */
        val = -1*val;
        /* Multiplies calculated value by -1 */
        neg = 0;
        /* Resets negative flag */
      }
      values[++valTop] = val;
      /* Pushes the value on to the value stack */
      i = i - 1;
      /* Decrements so position is correct */
    } else if (expression[i] == ')'){
      while (opsTop != -1 && ops[opsTop] != '(')
      {
        double y = values[valTop--];
        double x = values[valTop--];
        char op = ops[opsTop--];
        /* Pops off two values from value stack, and an operator */
        values[++valTop] = apply(x, y, op);
        /* Pushes the new calculated value on to the values stack */
      }
      /* Performs the operation retained in the brackets */
      opsTop--;
      /* Pops the operation stack to remove the opening brace */
    } else if (expression[i] == '+' || expression[i] == '-' || expression[i] == '*' || expression[i] == '/') {
      /* Character is an operator */
      while (opsTop != -1 && priority(ops[opsTop]) >= priority(expression[i]))
      {
        double y = values[valTop--];
        double x = values[valTop--];
        char op = ops[opsTop--];
        /* Pops off two values from value stack, and an operator */
        values[++valTop] = apply(x, y, op);
        /* Pushes the new calculated value on to the values stack */
      }
      /* Calculates all operations of higher priority than current operator */
      ops[++opsTop] = expression[i];
      /* Pushes current operator on to ops stack */

      if (expression[i+1] == '-'){
        neg = 1;
        /* Negative flag is set true as only case where an operator following an operator makes sense */
        i = i + 1;
        /* Increments to skip the minus operator */
      }
    }
    i = i + 1;
    /* Traverses to the next character in the expression */
  }

  while (opsTop != -1)
  /* Until the ops stack is empty */
  {
    double y = values[valTop--];
    double x = values[valTop--];
    char op = ops[opsTop--];
    /* Pops off two values from value stack, and an operator */
    values[++valTop] = apply(x, y, op);
    /* Pushes the new calculated value on to the values stack */
  }
  double final = values[valTop--];
  /* The last value contained in the values stack is the solution */
  return final;
  /* Returns type double evaluated expression */
}
```

Which we can then very easily integrate into our file editor by reusing code we used to show a single line - instead we just pass the line into our evaluate function, and update the file.