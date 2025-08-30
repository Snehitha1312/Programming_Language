/* Precedence */
%left OR AND
%left LT GT LE GE EQ NE
%left '+' '-'
%left '*' '/' '%'
%right '=' PASN MASN DASN SASN
%right UMINUS INC DEC
%token RETURN


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
 | IF BOOLEXPR ')' M A ELSE NN M A    /* error handling */
 | EXPR error MEOF
 | WHILE M '(' BOOLEXPR ')' M A
 | WHILE M BOOLEXPR ')' M A           /* error handling */
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


/* Functions  */
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
 | IDEN INDEX '=' '{' INITLIST '}'   /* array initialization */
;

INITLIST: INITLIST ',' EXPR
 | EXPR
;

INDEX: '[' NUM ']'
 | '[' NUM ']' INDEX
;


TYPE: INT
 | FLOAT
 | CHAR
 | VOID
;


ASSGN: '=' | PASN | MASN | DASN | SASN ;

ASNEXPR: EXPR ASSGN EXPR ;


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
 | FUNC_CALL                  
 | TERM
 | '-' EXPR %prec UMINUS
;

/* Function calls  */
FUNC_CALL: IDEN '(' ARGLIST ')'
;

ARGLIST: EXPR ',' ARGLIST
 | EXPR
 | /* empty */
;


TERM: IDEN
 | NUM
 | '(' EXPR ')'
 | IDEN INC
 | IDEN DEC
 | INC IDEN
 | DEC IDEN
;

/* Markers */
M:
NN:
