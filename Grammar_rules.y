S:  STMNTS M MEOF
	| MEOF
	| error MEOF
	;

A: ASNEXPR ';' 
	| ASNEXPR error MEOF
	| IF '(' BOOLEXPR ')' M  A 
	| IF '(' BOOLEXPR ')' M A ELSE NN M A 
	| EXPR error MEOF
	| IF BOOLEXPR ')' M A ELSE NN M A
	| WHILE M '(' BOOLEXPR ')' M A
	| WHILE M  BOOLEXPR ')' M A
	| FOR '(' FORINIT ';' BOOLEXPR ';' FORINC ')' M A   /* NEW: for loop */
	| '{'  STMNTS '}' 
	| '{' '}' 
	| EXPR ';'
	| DECLSTATEMENT
	;

DECLSTATEMENT: TYPE DECLLIST ';' 
	| TYPE DECLLIST  error MEOF 
	;

DECLLIST: IDEN ',' DECLLIST 
	| IDEN INDEX ',' DECLLIST 
	| IDEN 
	| IDEN '=' EXPR 
	| IDEN INDEX 
	;

INDEX: '[' NUM ']' 
	| '[' NUM ']' INDEX 
	;

TYPE: INT 
	| FLOAT  
	| CHAR 
	;

STMNTS: STMNTS M A  
	| A M
	;

ASSGN: '=' 
	 | PASN 
	 | MASN 
     | DASN 
     | SASN  
	;

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

M: 
NN: 

ASNEXPR: EXPR ASSGN EXPR 
	;

EXPR: EXPR '+' EXPR 
    | EXPR '-' EXPR 
    | EXPR '*' EXPR 
	| EXPR '/' EXPR 
	| EXPR '%' EXPR 
	| EXPR OP ';'
    | TERM 
	;

OP: '+' | '-' | '*' | '/' | '%';

TERM: UN OPR IDEN B  
    | UN IDEN OPR B 
    | UN NUM C 
    | UN IDEN C 
    | UN INC NUM 
    | UN DEC NUM 
    | UN NUM INC 
    | UN NUM DEC
	;

OPR: INC | DEC;

B : OPR 
  | IDEN 
  | NUM 
  | ;

C : IDEN 
  | NUM 
  | ;

UN : '-'  ;


FOR: FOR;    

FORINIT: ASNEXPR 
       | DECLSTATEMENT
       | /* empty */   
       ;

FORINC: ASNEXPR 
      | EXPR 
      | /* empty */    
      ;
