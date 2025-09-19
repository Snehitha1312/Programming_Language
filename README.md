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
## Contribution Summary  
In this session, I worked on the **Functions** aspect of the module, focusing on defining user-defined functions, function declarations, and function calls within the grammar. My contribution emphasized **modularity, reusability, and structured programming practices**.

---

## Detailed Work  

### 1. Function Declaration & Definition  
- Functions can be **declared** with return types, identifiers, and parameter lists.  
- A **declaration (prototype)** specifies the function’s type, name, and parameters but does not define its body.  
- A **definition** provides the full body of the function, including the statements that describe its behavior.  

---

### 2. Function Arguments and Declarations  

#### Function Declarations (FUNCDECL)  
A function can appear in two forms:  

1. **Function Prototype / Declaration**  
   - Begins with a return type.  
   - Followed by a function name (identifier).  
   - Contains a parameter list inside parentheses.  
   - Ends with a semicolon.  
   - Example meaning: *“This declares that a function exists but doesn’t define what it does.”*  

2. **Function Definition**  
   - Same as a prototype, but instead of ending with a semicolon, it includes a body enclosed in `{ }`.  
   - Inside the body, there can be multiple statements.  
   - Example meaning: *“This fully defines what the function does.”*  

---

### 3. Parameter List (PARAMLIST)  
- Defines what goes inside the parentheses of a function.  
- Can be:  
  - One parameter  
  - Multiple parameters separated by commas  
  - Empty (function takes no arguments)  

---

### 4. Parameters (PARAM)  
- Each parameter has a **type** followed by a **name**.  
- Optionally, it may include **array indexing** (for array parameters).  
- Each parameter acts as an input variable to the function.  

---

### 5. Return Statements  
Functions can return values or simply exit:  

1. **Return with a Value**  
   - Uses the `return` keyword followed by an expression.  
   - Ends with a semicolon.  
   - Example meaning: *“Return the result of this expression to the caller.”*  

2. **Return without a Value**  
   - Just the `return` keyword with a semicolon.  
   - Example meaning: *“Exit the function without returning anything.”*  

---

### 6. Functional Explanation  
- **Modularity:** Functions encapsulate logic into reusable blocks.  
- **Parameters & Arguments:** Functions can take inputs, process them, and return outputs.  
- **Return Types:** Supports return types like `int`, `float`, `char`, and `void`.  
- **Integration with Loops:** Functions can include iterative constructs such as `for` loops, enhancing reusability and clarity.  

---

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
- Noted a list of **library functions** (arithmetic operations,algorithemic functions) to be implemented as part of the standard library for our programming language.  
 **Link to the Doc for Lib Func:** https://docs.google.com/document/d/1ye-qCDcHGzWspuikXosHASviOivtn5AywaK-I83aARM/edit?usp=sharing

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

### 5/9/2025   
- Started drafting notes for a set of **algorithmic utility functions** to be implemented in the next phase.  

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
- Started implementing basic **I/O functions** (`cin`, `cout`, `getline`) for the standard library and tried to implement text Editor

---
# Contributions - Module 4  

## Snehitha  
### 15/9/2025  ( Lines- 176-193)
- Added **Encapsulation grammar rules** in `Grammar_rules.gs`.
- Implemented grammar rules for **Constructors**.   

### 16/9/2025  
- Read about **text editor design** and explored about how to implement it.
- Decided extension for Library_functions

### 17/9/2025 and 18/9/2025  (Lines 132-200)
- In the `StringHandler` class of Library_functions.gs the following were implemented:  
  - `length(const char* str)`  
  - `substr(const char* str, int start, int len, char* res)`  
  - `insert(char* str, int pos, const char* toInsert)`  
  - `compare(const char* s1, const char* s2)`  
  - `erase(char* str, int pos, int len)`  
  - `islower(char c)`  

### 19/9/2025 (Lines 12-31)
- Implemented the following in **IOHandler class**:  
  - `readChar()`  
  - `readString(char* buffer, int size)`  
  - `readInt()`   
- Contributed **5 test cases** covering grammar rules, string functions, and I/O functions.  

---

## Greeshma  
### 15/9/2025  (Lines 206-214)
- Added **Abstraction grammar rules** in `Grammar_rules.gs`.
- Implemented grammar rules for **Destructors**.  

### 16/9/2025  
- Read about **text editor design** and explored how to implement it.
- Decided extension for Library_functions

### 17/9/2025 and 18/9/2025  (Lines 203-232)
-  In the `StringHandler` class of Library_functions.gs the following were implemented:  
  - `isupper(char c)`  
  - `tolower(char c)`  
  - `toupper(char c)`  
  - `isalpha(char c)`  
  - `isalnum(char c)`  
  - `isnum(char c)`  

### 19/9/2025  (Lines 34-53)
- Implemented the following in **IOHandler class**:  
  - `printString(const char* str)`  
  - `printInt(int x)`  
  - `printDouble(double x)`  
- Contributed **5 test cases** covering grammar rules, string functions, and I/O functions.  

---



