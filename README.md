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

# Contributions

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

