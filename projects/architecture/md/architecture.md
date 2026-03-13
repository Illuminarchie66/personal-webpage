# Coursework 1
This was the coursework for the Computer Organisation and Architecture module in my firsy year of university. This had a fun mix of theory and programming questions focused on computer memory, binary, and how a computer system works. For this retrospective, I will briefly detail each of the questions and what was required of me and the basic solution ! However, you can read the full coursework PDF attached on this page. Additionally, check out the GitHub for the code itself, and a guide for how to run the code. 

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


### signed binary sum

# Coursework 2
## Powerset
## Text editor