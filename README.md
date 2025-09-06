# Status Report – Programming Language(Module 1)

## Objective of Module 1
- Designing the grammar rules and syntactic structure of the new language.  
- Implementing a lexer (tokenizer) and parser using **Lex** and **Yacc**.  
- Planning for the development of a basic language editor.  

---

## Current Progress

### 1. Lexical Analyzer (`.l` file)
A base lexical analyzer has been implemented using **Lex**.  

- The lexer scans the input source code and breaks it into **tokens**, which are passed to the parser.  
- **Current tokens supported include:**  
  - **Keywords:** `if`, `else`, `while`, `int`, `float`, `char`, etc.  
  - **Operators:** `+`, `-`, `*`, `/`, `=`, `==`, `!=`, `<`, `>`, `++`, `--`.  
  - **Identifiers:** User-defined variable names.  
  - **Constants:** Numeric constants (integers and floats).  
  - **Delimiters & Punctuation:** `;`, `,`, `{`, `}`, `(`, `)`.  

- For operators like `++` and `--`, values are appended to semantic values (`yylval.str`) to be passed correctly to the parser.  

---

### 2. Syntax Analyzer (`.y` file)
A base syntax analyzer has been implemented using **Yacc**.  

- The parser uses the tokens from the lexer and checks if the input program follows the defined **grammar rules**.  

- **Currently supported grammar rules:**  
  - **Variable declarations:** `int x;`, `float y;`  
  - **Assignment statements:** `x = 10;`, `y = x + 2;`  
  - **Conditional statements:**  
    ```c
    if (condition) {
        ...
    } else {
        ...
    }
    ```  
  - **Loops (basic):** `while` loops are partially supported.  
  - **Expressions:** Arithmetic and relational expressions are handled.  
  - **Error handling:** Parser prints **syntax error messages** when unexpected tokens appear.  

---


## Grammar Rules:

-----------------------------------
 Start Rule
-----------------------------------
S              → STMNTS M MEOF
               | MEOF
               | error MEOF


-----------------------------------
 Statements
-----------------------------------
STMNTS         → STMNTS M A
               | A M

A              → ASNEXPR ';'
               | ASNEXPR error MEOF
               | IF '(' BOOLEXPR ')' M A
               | IF '(' BOOLEXPR ')' M A ELSE NN M A
               | IF BOOLEXPR ')' M A ELSE NN M A
               | WHILE M '(' BOOLEXPR ')' M A
               | WHILE M BOOLEXPR ')' M A
               | '{' STMNTS '}'
               | '{' '}'
               | EXPR ';'
               | EXPR error MEOF
               | DECLSTATEMENT
               | FUNCDECL


-----------------------------------
 Function Declarations
-----------------------------------
FUNCDECL       → TYPE IDEN '(' PARAMLIST ')' ';'
               | TYPE IDEN '(' PARAMLIST ')' '{' STMNTS '}'
               | TYPE IDEN '(' ')' ';'
               | TYPE IDEN '(' ')' '{' STMNTS '}'

PARAMLIST      → PARAM ',' PARAMLIST
               | PARAM

PARAM          → TYPE IDEN
               | TYPE IDEN INDEX


-----------------------------------
 Declarations
-----------------------------------
DECLSTATEMENT  → TYPE DECLLIST ';'
               | TYPE DECLLIST error MEOF

DECLLIST       → IDEN ',' DECLLIST
               | IDEN INDEX ',' DECLLIST
               | IDEN
               | IDEN '=' EXPR
               | IDEN INDEX

INDEX          → '[' NUM ']'
               | '[' NUM ']' INDEX


-----------------------------------
 Types
-----------------------------------
TYPE           → INT
               | FLOAT
               | CHAR


-----------------------------------
 Assignments
-----------------------------------
ASNEXPR        → EXPR ASSGN EXPR

ASSGN          → '='
               | PASN
               | MASN
               | DASN
               | SASN


-----------------------------------
 Boolean Expressions
-----------------------------------
BOOLEXPR       → BOOLEXPR OR M BOOLEXPR
               | BOOLEXPR AND M BOOLEXPR
               | '!' BOOLEXPR
               | '(' BOOLEXPR ')'
               | EXPR LT EXPR
               | EXPR GT EXPR
               | EXPR EQ EXPR
               | EXPR NE EXPR
               | EXPR LE EXPR
               | EXPR GE EXPR
               | TR
               | FL


-----------------------------------
 Expressions
-----------------------------------
EXPR           → EXPR '+' EXPR
               | EXPR '-' EXPR
               | EXPR '*' EXPR
               | EXPR '/' EXPR
               | EXPR '%' EXPR
               | EXPR OP ';'
               | TERM

OP             → '+'
               | '-'
               | '*'
               | '/'
               | '%'

TERM           → UN OPR IDEN B
               | UN IDEN OPR B
               | UN NUM C
               | UN IDEN C
               | UN INC NUM
               | UN DEC NUM
               | UN NUM INC
               | UN NUM DEC

OPR            → INC
               | DEC


-----------------------------------
 Helpers
-----------------------------------
B              → OPR
               | IDEN
               | NUM
               | ε

C              → IDEN
               | NUM
               | ε

UN             → '-'


-----------------------------------
 Misc
-----------------------------------
M              → ε
NN             → ε

# Contributions - Module 1

## Snehitha
- Worked on base code
- Added tokens for keywords, identifiers, operators, constants, and delimiters
- Worked on expression handling in parser and grammer rules for declarations,assignments(.y file)
- Helped in preparing system specification document

## Greeshma
- Implemented syntax analyzer 
- Defined grammar rules for conditionals and loops
- Added error handling for invalid syntax
- Worked on project documentation (status report)

## Bilwani
- Worked on lexer file
- Text editor basic plan

# Contributions- Module 2

## Snehitha:


## Greeshma:

 ### Summary:
 In this module, I focused on enhancing the grammar by adding iterative structures, error handling, array initialization rules, function calls, and operator precedence rules. These additions strengthened the expressiveness and robustness of the programming language.

 ### Detailed Work :

### 1. For Loop Grammar 
Implemented grammar rules for the **for loop**, ensuring proper handling of initialization, condition, and increment/decrement parts. Example usage:
c
for (i = 0; i < 10; i++) { ... }

### 2. Error Handling in Iterative Structures  
Added rules to capture possible **syntax errors** in iterative constructs like `if` and `while`.  

This improves compiler feedback by catching mistakes such as missing parentheses or semicolons, helping programmers debug easily.  

### 3. Array Initialization  
Introduced grammar rules for **array declaration and initialization**, enabling structured data representation.  

Example usage:  
```c
int arr[3] = {1, 2, 3};
int matrix[2][3] = {{1, 2, 3}, {4, 5, 6}};
```

### 4. Function Calls  
Defined grammar rules to support **function calls** with parameters as well as empty parameter lists.  

Example usage:  
```c
sum(a, b);
print();
```

### 5. Operator Precedence  
Defined **operator precedence and associativity** rules to ensure expressions are parsed and evaluated in the correct order.  

Example usage:  
```c
a + b * c;        // multiplication has higher precedence than addition
x = y + z;        // assignment has right-associativity
if (a < b && c > d) { ... }  // logical AND evaluated after relational checks
```

# Contributions - Module 3

## Greeshma  
### 1/9/2025  
- Researched basics of **text editor design** and created initial notes on required features for a simple *vi-like editor*.  

### 2/9/2025
- Compiled a list of **library functions** (arithmetic operations) to be implemented as part of the standard library for our programming language.  

### 3/9/2025  
- Studied how **library creation works** in C/C++/Java, focusing on compilation and linking steps.  
- Implemented grammar rules in `Grammar_rules.y` for:  
  - **Ternary operator (`?:`)**  
  - **Do–while loop**  

### 4/9/2025
- Began coding the **Arithmetic library** (`Library_Functions.lib`).  
- Implemented the following functions:  
  - `min(int, int)` / `min(double, double)`  
  - `max(int, int)` / `max(double, double)`  
  - `power(double base, int exp)`  

---

## Snehitha
**01/09/2025**
- Researched text editor design in parallel with Greeshma, focusing on editing commands and file handling features.

**02/09/2025**
- Created a list of additional libraries to be implemented beyond arithmetic (e.g., string handling, file I/O).
  **Link to the Spec Doc for Lib Func:** https://docs.google.com/document/d/1ye-qCDcHGzWspuikXosHASviOivtn5AywaK-I83aARM/edit?usp=sharing

**03/09/2025**
- Learned about the steps of library creation in C/C++/Java to understand how `.lib` files will integrate with the linker.
- Extended `Grammar_rules.y` by adding grammar rules for:
  - Boolean literals (`true`, `false`).

**04/09/2025**
- Started coding the Arithmetic library (`Library_Functions.lib`).
  -**Implemented the following functions**:
    - `min(int, int)` / `min(double, double)`  
    - `max(int, int)` / `max(double, double)`  
    - `power(double base, int exp)`
      
**05/09/2025**
 **5 test cases** for grammar and library features:  
  1. Simple addition (`a + b`)  
  2. Conditional check with `if–else`  
  3. `while` loop incrementing counter  
  4. `for` loop with multiplication  
  5. Another `for` loop with multiplication (duplicate for stability testing)  

**Additional Work**
- Started implementing basic **I/O functions** (`cin`, `cout`, `getline`) for the standard library.

---


