/* Precedence */
%left OR AND
%left LT GT LE GE EQ NE
%left '+' '-'
%left '*' '/' '%'
%right '=' PASN MASN DASN SASN
%right UMINUS INC DEC
%right '?' ':'                /* ternary operator*/
%token RETURN BREAK CONTINUE
%token DO 
%token STRING STR             /* STR is literal, STRING token is for type"
%token TR FL                  /* boolean literals*/


S: STMNTS M MEOF
 | MEOF
 | error MEOF
;

STMNTS: STMNTS M A
 | A M
;

A: ASNEXPR ';'
 | ASNEXPR error MEOF
 | IF '(' BOOLEXPR ')' M A
 | IF '(' BOOLEXPR ')' M A ELSE NN M A
 | IF BOOLEXPR ')' M A ELSE NN M A      /* error handling */
 | EXPR error MEOF
 | WHILE M '(' BOOLEXPR ')' M A
 | WHILE M BOOLEXPR ')' M A             /*error handling */
 | DO M A WHILE M '(' BOOLEXPR ')' ';'  
 | FOR '(' ASNEXPR ';' M BOOLEXPR ';' M ASNEXPR ')' M A 
 | '{' STMNTS '}'
 | '{' '}'
 | EXPR ';'
 | DECLSTATEMENT
 | FUNCDECL
 | RETURN EXPR ';'
 | RETURN ';'             
 | BREAK ';'            
 | CONTINUE ';'           
 | ';'                   
;


FUNCDECL: TYPE IDEN '(' PARAMLIST ')' ';'
 | TYPE IDEN '(' PARAMLIST ')' '{' STMNTS '}'
;

PARAMLIST: PARAM ',' PARAMLIST
 | PARAM
 | /* empty */
;

PARAM: TYPE IDEN
 | TYPE IDEN INDEX
;

DECLSTATEMENT: TYPE DECLLIST ';'
 | TYPE DECLLIST error MEOF
;

DECLLIST: DECL ',' DECLLIST
 | DECL
;

DECL: IDEN
 | IDEN '=' EXPR
 | IDEN INDEX
 | IDEN INDEX '=' '{' INITLIST '}'   /*initializing array*/
;

INITLIST: INITLIST ',' EXPR
 | EXPR
;


INDEX: '[' EXPR ']'
 | '[' EXPR ']' INDEX
;

TYPE: INT
 | FLOAT
 | CHAR
 | VOID
 | STRING
;

ASSGN: '=' | PASN | MASN | DASN | SASN ;


LVAL: IDEN
    | IDEN INDEX
;

ASNEXPR: LVAL ASSGN EXPR ;

BOOLEXPR:
  BOOLEXPR OR M BOOLEXPR
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
;


EXPR: EXPR '+' EXPR
 | EXPR '-' EXPR
 | EXPR '*' EXPR
 | EXPR '/' EXPR
 | EXPR '%' EXPR
 | EXPR '?' EXPR ':' EXPR        /*ternary-condition*/
 | FUNC_CALL                  
 | TERM
 | '-' EXPR %prec UMINUS
;


FUNC_CALL: IDEN '(' ARGLIST ')'
;

ARGLIST: EXPR ',' ARGLIST
 | EXPR
 | /* empty */
;

/* I/O operations*/
PRINTARGS: EXPR
         | EXPR ',' PRINTARGS
;

LVALIST: LVAL
       | LVAL ',' LVALIST
;


TERM: IDEN
 | IDEN INDEX
 | NUM
 | STR
 | TR
 | FL
 | '(' EXPR ')'
 | IDEN INC
 | IDEN DEC
 | IDEN INDEX INC
 | IDEN INDEX DEC
 | INC IDEN
 | DEC IDEN
 | INC IDEN INDEX
 | DEC IDEN INDEX
;

/* Markers */
M:
NN: /*Marker to handle else part*/
