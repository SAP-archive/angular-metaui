/**
 *
 *
 * MetaUILexer is OSS tokenizer that recognizes all the supported token. There can be several
 * tokens in the OSS language:
 *
 * Spaces & new lines => Skipped
 *
 * Comments => Scans and returns TOKEN
 *
 * Identifier => Scans and returns TOKEN
 * ex:
 *   ["a"-"z","A"-"Z","_"] ( ["a"-"z","A"-"Z","_","0"-"9"] )*
 *   Commons symbols, keywords
 *
 * Expression => Scans and returns TOKEN
 * ex:
 *  ${value}
 *
 * StaticDynamicExpr =>  Scans and returns TOKEN
 *  ex:
 *      $${value}
 *
 *
 * Key Path => Scans and returns TOKEN
 *  ex:
 *  ["a"-"z","A"-"Z","_"] ( ["a"-"z","A"-"Z","_","0"-"9", ".", "$"] )*
 *   form1.zLeft
 *
 * Dynamic field path binding =>  Scans and returns TOKEN
 * ex:
 *    "$" ["a"-"z","A"-"Z","_"] ( ["a"-"z","A"-"Z","_","0"-"9", "."] )* >
 *    $object
 *    $object.aaa
 *
 * Integer => Scans and returns TOKEN
 * ex:
 *    Integer 111
 *    Float   1.22
 *
 *
 * String literals => Scans and returns TOKEN
 * ex:
 *      Single Queues
 *      Double Queues
 *
 * I18n =>  Scans and returns TOKEN
 *      $[KEY001]
 *
 *
 *
 */
export class MetaUILexer
{

    pos: number;
    column: number;
    line: number;
    nexChar: number;
    currChar: number;


    constructor(private input: string)
    {
        this.pos = 0;
        this.column = 1;
        this.line = 1;

        this.currChar = this.input.charCodeAt(this.pos);
        this.nexChar = this.peek();
    }


    nextToken(): MetaUIToken
    {

        while (this.currChar !== LexerUtils.EOF) {

            if (LexerUtils.isSpace(this.currChar)) {
                this.consumeSpaces();
            }

            if (LexerUtils.isComment([this.currChar, this.nexChar])) {
                let isBlockComment = LexerUtils.isBlockCommentStart([this.currChar, this.nexChar]);
                return this.toCommentToken(isBlockComment);
            }

            if (LexerUtils.isCommonSymbol([this.currChar, this.nexChar])) {
                return this.toCommonSymbolToken();
            }

            if (LexerUtils.isAlpha(this.currChar)) {
                return this.toIdentifierOrKeyPathToken();
            }

            if (LexerUtils.isExpressiontart([this.currChar, this.nexChar])) {
                return this.toExpressionToken();
            }

            if (LexerUtils.isFieldPathBinding([this.currChar, this.nexChar])) {
                return this.fieldPathBindingToken();
            }

            if (LexerUtils.isI18nKey([this.currChar, this.nexChar])) {
                return this.i18nKeyToken();
            }

            if (LexerUtils.isStrLiteralStart(this.currChar)) {
                return this.stringToken();
            }

            if (LexerUtils.isDigit(this.currChar)) {
                return this.numberToken();
            }
            this.currChar = LexerUtils.EOF;
        }
        return new MetaUIToken(this.column, this.line, MetaUITokenType.EOF, null, this.pos,
            this.pos);
    }

    private advance(): void
    {
        if (LexerUtils.isLineEnds(this.currChar)) {
            this.column = 1;
            this.line++;
        } else {
            this.column++;
        }
        this.pos++;

        if (this.pos > this.input.length - 1) {
            this.currChar = this.nexChar = LexerUtils.EOF;

        } else {
            this.currChar = this.input.charCodeAt(this.pos);
            this.nexChar = this.peek();
        }
    }

    peekNextToken(): MetaUIToken
    {
        let currPos = this.pos;
        let currColumn = this.column;
        let currLine = this.line;
        let currNxC = this.nexChar;
        let currCChar = this.currChar;

        let nextToken = this.nextToken();

        this.pos = currPos;
        this.column = currColumn;
        this.line = currLine;
        this.nexChar = currNxC;
        this.currChar = currCChar;

        return nextToken;
    }


    private peek(): number
    {
        let nextPos = this.pos + 1;
        if (nextPos > this.input.length - 1) {
            return LexerUtils.EOF;
        }
        return this.input.charCodeAt(nextPos);
    }

    private error(msg: string): void
    {
        throw new Error('Error while parsing: ' + msg);
    }

    private toIdentifierOrKeyPathToken(): MetaUIToken
    {

        let startPos = this.pos;
        let startLine = this.line;
        let columnStart = this.column;
        let isKeyPath = false;

        let tokenType: MetaUITokenType = MetaUITokenType.Identifier;
        let value = '';

        let identifier: (code: number) => boolean = (code: number) => LexerUtils
            .isAlphaNum(this.currChar) || LexerUtils.isKeyPathChar(this.currChar);

        // first char must be ["a"-"z","A"-"Z","_"] then followed by alpha+num
        while (!LexerUtils.isEOF(this.currChar) && identifier(this.currChar)) {

            value += this.input[this.pos];
            this.advance();

            // or if key path then . or $
            if (LexerUtils.isKeyPathChar(this.currChar)) {
                tokenType = MetaUITokenType.KeyPath;
                isKeyPath = true;
            }
        }

        if (!isKeyPath && LexerKeywordTokensTable.has(value)) {
            tokenType = LexerKeywordTokensTable.get(value);

        } else if (!isKeyPath && (value === 'true' || value === 'false')) {
            tokenType = (value === 'true') ? MetaUITokenType.BOOLTRue : MetaUITokenType.BOOLFalse;

        } else if (!isKeyPath && value === 'null') {
            tokenType = MetaUITokenType.Null;
        }
        return new MetaUIToken(columnStart, startLine, tokenType, value, startPos,
            (startPos + value.length));
    }

    private toExpressionToken(): MetaUIToken
    {

        let startPos = this.pos;
        let startLine = this.line;
        let columnStart = this.column;

        let type: MetaUITokenType = MetaUITokenType.ExprLiteral;

        let value = '';

        // staticaly resolvable expr.
        if (this.currChar === LexerUtils.DOLLAR && this.nexChar === LexerUtils.DOLLAR) {
            this.advance(); // On $
            this.advance(); // On {

            type = MetaUITokenType.ExprLiteralStaticDyn;

        } else {
            this.advance(); //  On {
        }

        if (this.currChar !== LexerUtils.LBRACE) {
            this.error('Invalid Expression. Missing {');
        }


        this.advance(); // Move after {

        while (LexerUtils.RBRACE !== this.currChar) {
            if (LexerUtils.isEOF(this.currChar)) {
                this.error('Literal expression is not terminated');
            }
            value += this.input[this.pos];
            this.advance();
        }
        this.advance();
        return new MetaUIToken(columnStart, startLine, type, value.trim(), startPos,
            (startPos + value.length));
    }

    private fieldPathBindingToken(): MetaUIToken
    {

        let columnStart = this.column;
        let startPos = this.pos;
        let startLine = this.line;

        this.advance(); // after $
        let value = '';

        let validFieldPathChar: (code: number) => boolean = (code: number) =>
        {
            return LexerUtils.isAlphaNum(code) || LexerUtils.DOT === code;
        };

        while (validFieldPathChar(this.currChar)) {
            value += this.input[this.pos];
            this.advance();
        }

        return new MetaUIToken(columnStart, startLine, MetaUITokenType.FieldPathBinding, value,
            startPos, (startPos + value.length));
    }

    private numberToken(): MetaUIToken
    {
        let startPos = this.pos;
        let columnStart = this.column;
        let startLine = this.line;
        let type: MetaUITokenType = MetaUITokenType.IntLiteral;

        let consumeNums: () => void = () =>
        {
            while (!LexerUtils.isEOF(this.currChar) && LexerUtils.isDigit(this.currChar)) {
                value += this.input[this.pos];
                this.advance();
            }
        };
        let value = this.input[this.pos];
        consumeNums();

        if (this.currChar === LexerUtils.DOT) {
            value += this.input[this.pos];
            this.advance();

            consumeNums();
            type = MetaUITokenType.FltLiteral;
        }
        return new MetaUIToken(columnStart, startLine, type, value, startPos,
            (startPos + value.length));
    }

    private stringToken(): MetaUIToken
    {
        let startPos = this.pos;
        let startLine = this.line;
        let columnStart = this.column;
        let currQuote = this.currChar; // this can be ' or "

        let value = '';
        this.advance(); // after ' or "

        while (currQuote !== this.currChar) {
            value += this.input[this.pos];
            this.advance();

            if (LexerUtils.isEOF(this.currChar)) {
                this.error('string literal is not correctly terminated.');
            }
        }
        this.advance(); // after ' or "
        return new MetaUIToken(columnStart, startLine, MetaUITokenType.StringLiteral, value,
            startPos, (startPos + value.length));
    }

    private i18nKeyToken(): MetaUIToken
    {
        let startPos = this.pos;
        let startLine = this.line;
        let columnStart = this.column;

        this.advance(); // after $
        this.advance(); // after [
        let value = '';

        // consume i18n content
        while (LexerUtils.isAlphaNum(this.currChar)) {

            value += this.input[this.pos];
            this.advance();
        }
        // once we consume all aphanum => expect closing bracket, otherwise show error
        if (LexerUtils.RBRACKET !== this.currChar) {
            this.error('i18n key is not correctly terminated');
        }

        this.advance(); // after ]
        return new MetaUIToken(columnStart, startLine, MetaUITokenType.I18nKey, value,
            startPos, (startPos + value.length));
    }

    private toCommonSymbolToken(): MetaUIToken
    {
        let posStart = this.pos;
        let lineStart = this.line;
        let columnStart = this.column;
        let tokenType: MetaUITokenType;

        let value = '';

        switch (this.currChar) {
            case LexerUtils.SEMI:
            case LexerUtils.COLON:
            case LexerUtils.COMA:
            case LexerUtils.AT:
            case LexerUtils.HASH:
            case LexerUtils.DOT:
            case LexerUtils.LP:
            case LexerUtils.RP:
            case LexerUtils.LBRACE:
            case LexerUtils.RBRACE:
            case LexerUtils.LBRACKET:
            case LexerUtils.RBRACKET:
            case LexerUtils.NEGATE:
            case LexerUtils.EXCLMARK:
                tokenType = LexerCommonTokensTable.get(this.currChar);
                value += this.input[this.pos];
                this.advance();
                break;

            case LexerUtils.EQ:
                if (this.nexChar === LexerUtils.GT) { // =>

                    value += this.input[this.pos];
                    this.advance();
                    value += this.input[this.pos];
                    this.advance();
                    tokenType = MetaUITokenType.NextPrecedenceChain;
                } else {
                    // regular =
                    value += this.input[this.pos];
                    this.advance();
                    tokenType = MetaUITokenType.OpEq;
                }
                break;
        }
        return new MetaUIToken(columnStart, lineStart, tokenType, value, posStart,
            (posStart + value.length));
    }

    /**
     * Parses Block or line level comment
     *
     */
    private toCommentToken(isBlock: boolean): MetaUIToken
    {
        let posStart = this.pos;
        let lineStart = this.line;
        let columnStart = this.column;

        let value = '';
        if (isBlock) {
            value = this.consumeBlockComment();
        } else {
            value = this.consumeLineComment();
        }


        return new MetaUIToken(columnStart, lineStart,
            isBlock ? MetaUITokenType.BlockComment : MetaUITokenType.LineComment,
            value, posStart, (posStart + value.length));

    }

    private consumeBlockComment()
    {
        let value: string = this.input[this.pos];

        while (!LexerUtils.isBlockCommentEnd([this.currChar, this.nexChar])) {
            if (LexerUtils.isEOF(this.currChar)) {
                this.error('block comment is not correctly terminated');
            }
            this.advance();
            value += this.input[this.pos];
        }
        this.advance(); // its last SLASH
        value += this.input[this.pos];

        this.advance(); // move pointer to the next char after SLASH
        return value;
    }

    private consumeLineComment()
    {
        let value: string = this.input[this.pos];

        while (!LexerUtils.isLineEnds(this.nexChar)) {
            if (this.currChar === LexerUtils.EOF) {
                this.error('line comment is not correctly terminated');
            }
            this.advance();
            value += this.input[this.pos];
        }
        this.advance();
        value += this.input[this.pos];
        return value;
    }

    private consumeSpaces(): void
    {
        while (!LexerUtils.isEOF(this.currChar) && LexerUtils.isSpace(this.currChar)) {
            this.advance();
        }
    }


}


export enum MetaUITokenType
{
    EOF,

    /**
     * Common Tokens and Symbols
     */
    LineComment, BlockComment, Semi, Colon, Coma, OpEq, At, Hash, Dot, LParen,
    RParen, LBrace, RBrace, LBracket, RBracket, NextPrecedenceChain, Star,
    NullMarker, ExclMark, BOOLTRue, BOOLFalse, Null,

    /**
     * RESERVED KEYWORDS Identifiers
     */
    KWClassIdentifier, KWDisplayKeyIdentifier, KWSearchOpIdentifier, KWTraitIdentifier,
    KWOperationIdentifier, KWFieldIdentifier, KWBindingsIdentifier, KWComponentIdentifier,
    KWObjectIdentifier, KWValueRedirectorIdentifier, KWActionIdentifier, KWActionResultsIdentifier,
    KWVisibleIdentifier, KWPageNameIdentifier, KWPageBindingsIdentifier, KWAfterIdentifier,
    KWZtopIdentifier, KWZbottomIdentifier, KWZleftIdentifier, KWZrightIdentifier,
    KWZmiddleIdentifier, KWZnoneIdentifier, KWLayoutIdentifier, KWHomepageIdentifier,
    KWModuleTraitIdentifier, KWModuleIdentifier, KWWrapperCompIdentifier,
    KWWrapperBindingsIdentifier, KWPortletWrapperIdentifier, KWDisplayGroupIdentifier,
    KWBeforeIdentifier, KWTextsearchSupportedIdentifier, KWUseTextIndexIdentifier,
    KWLabelIdentifier, KWEditableIdentifier, KWValidIdentifier, Identifier,


    /**
     * App specific literals and expressions
     */

    ExprLiteral, ExprLiteralStaticDyn, IntLiteral, FltLiteral, StringLiteral,
    FieldPathBinding, I18nKey, KeyPath


}

export class MetaUIToken
{

    constructor(public column: number, public line: number,
                public type: MetaUITokenType, public value?: string, public starts?: number,
                public ends?: number)
    {
    }


    toString(): string
    {
        return `"${MetaUITokenType[this.type]}" Token with value: ${
            (this.type === MetaUITokenType.EOF) ? 'EOF' : this.value}`;
    }
}


export const KeyIdentifier: MetaUITokenType[] = [
    MetaUITokenType.KWClassIdentifier, MetaUITokenType.KWDisplayKeyIdentifier,
    MetaUITokenType.KWSearchOpIdentifier, MetaUITokenType.KWTraitIdentifier,
    MetaUITokenType.KWOperationIdentifier, MetaUITokenType.KWFieldIdentifier,
    MetaUITokenType.KWBindingsIdentifier, MetaUITokenType.KWComponentIdentifier,
    MetaUITokenType.KWObjectIdentifier, MetaUITokenType.KWValueRedirectorIdentifier,
    MetaUITokenType.KWActionIdentifier, MetaUITokenType.KWActionResultsIdentifier,
    MetaUITokenType.KWVisibleIdentifier, MetaUITokenType.KWPageNameIdentifier,
    MetaUITokenType.KWPageBindingsIdentifier, MetaUITokenType.KWAfterIdentifier,
    MetaUITokenType.KWZtopIdentifier, MetaUITokenType.KWZbottomIdentifier,
    MetaUITokenType.KWZleftIdentifier, MetaUITokenType.KWZrightIdentifier,
    MetaUITokenType.KWZmiddleIdentifier, MetaUITokenType.KWZnoneIdentifier,
    MetaUITokenType.KWLayoutIdentifier, MetaUITokenType.KWHomepageIdentifier,
    MetaUITokenType.KWModuleTraitIdentifier, MetaUITokenType.KWModuleIdentifier,
    MetaUITokenType.KWWrapperCompIdentifier, MetaUITokenType.KWWrapperBindingsIdentifier,
    MetaUITokenType.KWPortletWrapperIdentifier, MetaUITokenType.KWDisplayGroupIdentifier,
    MetaUITokenType.KWBeforeIdentifier, MetaUITokenType.KWTextsearchSupportedIdentifier,
    MetaUITokenType.KWUseTextIndexIdentifier, MetaUITokenType.KWLabelIdentifier,
    MetaUITokenType.KWEditableIdentifier, MetaUITokenType.KWValidIdentifier,
    MetaUITokenType.Identifier
];

export const KeyProperty: MetaUITokenType[] = [
    MetaUITokenType.KWClassIdentifier, MetaUITokenType.KWDisplayKeyIdentifier,
    MetaUITokenType.KWSearchOpIdentifier, MetaUITokenType.KWTraitIdentifier,
    MetaUITokenType.KWOperationIdentifier, MetaUITokenType.KWFieldIdentifier,
    MetaUITokenType.KWBindingsIdentifier, MetaUITokenType.KWComponentIdentifier,
    MetaUITokenType.KWObjectIdentifier, MetaUITokenType.KWValueRedirectorIdentifier,
    MetaUITokenType.KWActionIdentifier, MetaUITokenType.KWActionResultsIdentifier,
    MetaUITokenType.KWVisibleIdentifier, MetaUITokenType.KWPageNameIdentifier,
    MetaUITokenType.KWPageBindingsIdentifier, MetaUITokenType.KWAfterIdentifier,
    MetaUITokenType.KWZtopIdentifier, MetaUITokenType.KWZbottomIdentifier,
    MetaUITokenType.KWZleftIdentifier, MetaUITokenType.KWZrightIdentifier,
    MetaUITokenType.KWZmiddleIdentifier, MetaUITokenType.KWZnoneIdentifier,
    MetaUITokenType.KWLayoutIdentifier, MetaUITokenType.KWHomepageIdentifier,
    MetaUITokenType.KWModuleTraitIdentifier, MetaUITokenType.KWModuleIdentifier,
    MetaUITokenType.KWWrapperCompIdentifier, MetaUITokenType.KWWrapperBindingsIdentifier,
    MetaUITokenType.KWPortletWrapperIdentifier, MetaUITokenType.KWDisplayGroupIdentifier,
    MetaUITokenType.KWBeforeIdentifier, MetaUITokenType.KWTextsearchSupportedIdentifier,
    MetaUITokenType.KWUseTextIndexIdentifier, MetaUITokenType.KWLabelIdentifier,
    MetaUITokenType.KWEditableIdentifier, MetaUITokenType.KWValidIdentifier,
    MetaUITokenType.Identifier, MetaUITokenType.StringLiteral
];


export const SimpleValue: MetaUITokenType[] = [
    MetaUITokenType.ExprLiteralStaticDyn, MetaUITokenType.IntLiteral, MetaUITokenType.FltLiteral,
    MetaUITokenType.Identifier, MetaUITokenType.KeyPath, MetaUITokenType.BOOLTRue,
    MetaUITokenType.BOOLFalse, MetaUITokenType.Null, MetaUITokenType.StringLiteral
];


export class LexerUtils
{
    static readonly EOF = 0;
    static readonly TAB = 9;
    static readonly SPACE = 32;
    static readonly EXCLMARK = 33; // !
    static readonly DQ = 34; // "
    static readonly HASH = 35; // #
    static readonly DOLLAR = 36; // $
    static readonly SQ = 39; // '
    static readonly STAR = 42; // *
    static readonly COMA = 44; // ,
    static readonly LP = 40; // (
    static readonly RP = 41;  // )
    static readonly DOT = 46; // .
    static readonly SLASH = 47; // /
    static readonly COLON = 58; // :
    static readonly SEMI = 59; // ;
    static readonly LT = 60; // <
    static readonly EQ = 61; // =
    static readonly GT = 62; // >
    static readonly AT = 64; // @

    static readonly LBRACKET = 91; // [
    static readonly RBRACKET = 93; // ]
    static readonly UNDERSCORE = 95; // _
    static readonly LBRACE = 123; // {
    static readonly RBRACE = 125; // }
    static readonly NEGATE = 126; // ~

    static readonly CHAR_A = 65; // A
    static readonly CHAR_Z = 90; // Z
    static readonly CHAR_a = 97; // a
    static readonly CHAR_z = 122; // z


    static readonly CHAR_0 = 48; // 0
    static readonly CHAR_9 = 57; // 9


    static readonly LineFeed = 10; // \n
    static readonly CarriageReturn = 13; // \r


    static readonly CommonTokens = [
        LexerUtils.SEMI, LexerUtils.COLON, LexerUtils.COMA, LexerUtils.EQ, LexerUtils.AT,
        LexerUtils.HASH, LexerUtils.HASH, LexerUtils.DOT, LexerUtils.LP, LexerUtils.RP,
        LexerUtils.LBRACE, LexerUtils.RBRACE, LexerUtils.LBRACKET, LexerUtils.RBRACKET,
        LexerUtils.NEGATE, LexerUtils.EXCLMARK
    ];


    static isSpace(code: number): boolean
    {
        return code === LexerUtils.SPACE || code === LexerUtils.TAB ||
            LexerUtils.isLineEnds(code);
    }


    static isEOF(code: number): boolean
    {
        return code === LexerUtils.EOF;
    }

    static isLineEnds(code: number): boolean
    {
        return code === LexerUtils.LineFeed || code === LexerUtils.CarriageReturn;
    }

    static isComment(codes: number[]): boolean
    {
        return LexerUtils.isBlockCommentStart(codes) || LexerUtils.isLineCommentStart(codes);
    }


    static isBlockCommentStart(codes: number[]): boolean
    {
        return codes[0] === LexerUtils.SLASH && codes[1] === LexerUtils.STAR;
    }


    static isLineCommentStart(codes: number[]): boolean
    {
        return codes[0] === LexerUtils.SLASH && codes[1] === LexerUtils.SLASH;
    }

    static isBlockCommentEnd(codes: number[]): boolean
    {
        return codes[0] === LexerUtils.STAR && codes[1] === LexerUtils.SLASH;
    }


    static isExpressiontart(codes: number[]): boolean
    {
        return (codes[0] === LexerUtils.DOLLAR && codes[1] === LexerUtils.LBRACE) ||
            (codes[0] === LexerUtils.DOLLAR && codes[1] === LexerUtils.DOLLAR);
    }

    static isAlpha(code: number): boolean
    {
        return (code >= LexerUtils.CHAR_a && code <= LexerUtils.CHAR_z) ||
            (code >= LexerUtils.CHAR_A && code <= LexerUtils.CHAR_Z) ||
            (code === LexerUtils.UNDERSCORE);
    }

    static isDigit(code: number): boolean
    {
        return code >= LexerUtils.CHAR_0 && code <= LexerUtils.CHAR_9;
    }


    static isAlphaNum(code: number): boolean
    {
        return LexerUtils.isAlpha(code) || LexerUtils.isDigit(code);
    }

    static isCommonSymbol(codes: number[])
    {
        return LexerUtils.CommonTokens.indexOf(codes[0]) !== -1 ||
            (codes[0] === LexerUtils.EQ && codes[1] === LexerUtils.GT);

    }

    static isFieldPathBinding(codes: number[]): boolean
    {
        return codes[0] === LexerUtils.DOLLAR && LexerUtils.isAlpha(codes[1]);
    }


    static isI18nKey(codes: number[]): boolean
    {
        return codes[0] === LexerUtils.DOLLAR && LexerUtils.LBRACKET === codes[1];
    }


    static isKeyPathChar(code: number)
    {
        return LexerUtils.DOT === code || LexerUtils.DOLLAR === code;

    }


    static isStrLiteralStart(code: number)
    {
        return LexerUtils.SQ === code || LexerUtils.DQ === code;
    }

}

const LexerCommonTokensTable: Map<number, MetaUITokenType> = new Map()
    .set(LexerUtils.SEMI, MetaUITokenType.Semi)
    .set(LexerUtils.COLON, MetaUITokenType.Colon)
    .set(LexerUtils.COMA, MetaUITokenType.Coma)
    .set(LexerUtils.AT, MetaUITokenType.At)
    .set(LexerUtils.HASH, MetaUITokenType.Hash)
    .set(LexerUtils.DOT, MetaUITokenType.Dot)
    .set(LexerUtils.STAR, MetaUITokenType.Star)
    .set(LexerUtils.EXCLMARK, MetaUITokenType.ExclMark)
    .set(LexerUtils.LP, MetaUITokenType.LParen)
    .set(LexerUtils.RP, MetaUITokenType.RParen)
    .set(LexerUtils.LBRACE, MetaUITokenType.LBrace)
    .set(LexerUtils.RBRACE, MetaUITokenType.RBrace)
    .set(LexerUtils.LBRACKET, MetaUITokenType.LBracket)
    .set(LexerUtils.RBRACKET, MetaUITokenType.RBracket)
    .set(LexerUtils.NEGATE, MetaUITokenType.NullMarker);


const LexerKeywordTokensTable: Map<string, MetaUITokenType> = new Map()
    .set('module', MetaUITokenType.KWModuleIdentifier)
    .set('class', MetaUITokenType.KWClassIdentifier)
    .set('field', MetaUITokenType.KWFieldIdentifier)
    .set('trait', MetaUITokenType.KWTraitIdentifier)
    .set('operation', MetaUITokenType.KWOperationIdentifier)
    .set('label', MetaUITokenType.KWLabelIdentifier)
    .set('layout', MetaUITokenType.KWLayoutIdentifier)
    .set('object', MetaUITokenType.KWObjectIdentifier)

    .set('component', MetaUITokenType.KWComponentIdentifier)
    .set('bindings', MetaUITokenType.KWBindingsIdentifier)

    .set('displayKey', MetaUITokenType.KWDisplayKeyIdentifier)
    .set('actionResults', MetaUITokenType.KWActionResultsIdentifier)
    .set('action', MetaUITokenType.KWActionIdentifier)

    .set('after', MetaUITokenType.KWAfterIdentifier)
    .set('before', MetaUITokenType.KWBeforeIdentifier)

    .set('zTop', MetaUITokenType.KWZtopIdentifier)
    .set('zBottom', MetaUITokenType.KWZbottomIdentifier)
    .set('zLeft', MetaUITokenType.KWZleftIdentifier)
    .set('zMiddle', MetaUITokenType.KWZmiddleIdentifier)
    .set('zRight', MetaUITokenType.KWZrightIdentifier)
    .set('zNone', MetaUITokenType.KWZnoneIdentifier)

    .set('visible', MetaUITokenType.KWVisibleIdentifier)
    .set('editable', MetaUITokenType.KWEditableIdentifier)
    .set('valid', MetaUITokenType.KWValidIdentifier)


    .set('valueRedirector', MetaUITokenType.KWValueRedirectorIdentifier)
    .set('pageName', MetaUITokenType.KWPageNameIdentifier)
    .set('pageBindings', MetaUITokenType.KWPageBindingsIdentifier)


    .set('searchOperation', MetaUITokenType.KWSearchOpIdentifier)
    .set('homePage', MetaUITokenType.KWHomepageIdentifier)
    .set('module_trait', MetaUITokenType.KWModuleTraitIdentifier)
    .set('wrapperComponent', MetaUITokenType.KWWrapperCompIdentifier)
    .set('wrapperBindings', MetaUITokenType.KWWrapperBindingsIdentifier)
    .set('portletWrapper', MetaUITokenType.KWPortletWrapperIdentifier)
    .set('displayGroup', MetaUITokenType.KWDisplayGroupIdentifier)
    .set('textSearchSupported', MetaUITokenType.KWTextsearchSupportedIdentifier)
    .set('useTextIndex', MetaUITokenType.KWUseTextIndexIdentifier);

