import {
    OSSFileAst,
    OSSRuleAst,
    OSSSelectorAst,
    OSSSelectorKeyAst,
    OSSValueAst,
    OSSTraitAst,
    OSSSimpleValueAst,
    OSSValueOrListValueAst,
    OSSRuleBodyAst,
    OSSRuleBodyKeyValueAst,
    Statement,
    OSSWrappedListValueAst,
    OSSMapValueAst
} from './metaui-ast';
import {
    MetaUITokenType,
    MetaUILexer,
    MetaUIToken,
    KeyIdentifier,
    SimpleValue,
    KeyProperty
} from './metaui-lexer';


export class MetaUIParser
{
    currentToken: MetaUIToken;


    constructor(private lexer: MetaUILexer)
    {
        this.currentToken = this.lexer.nextToken();
    }

    /**
     * Parse OSS Grammer:
     *
     *
     *
     */
    parse(): OSSFileAst
    {
        let rules = this.ruleList();
        if (!rules || rules.length === 0) {
            this.error('There are no rules to parse.');
        }

        let start = rules[0].start;
        let end = rules[rules.length - 1].end;

        let ossFile: OSSFileAst = new OSSFileAst(start, end, rules);


        if (!this.isToken(MetaUITokenType.EOF)) {
            this.error('Invalid state. We should be at end of the file');
        }

        return ossFile;
    }


    ruleList(): OSSRuleAst[]
    {

        let rules: OSSRuleAst[] = [];
        let rule: OSSRuleAst;

        while (!this.isToken(MetaUITokenType.EOF) && (rule = this.rule(rule)) !== null) {
            rules.push(rule);
        }
        return rules;
    }


    rule(parentRule?: OSSRuleAst): OSSRuleAst
    {
        let rule = new OSSRuleAst(this.currentToken.starts, this.selectorList(), this.traitList(),
            parentRule);

        if (this.isToken(MetaUITokenType.LBrace)) {
            rule.ruleBody = this.ruleBody(rule);
            this.eat(MetaUITokenType.RBrace);
        } else {
            this.eat(MetaUITokenType.Semi);
        }
        rule.end = this.currentToken.ends;
        return rule;
    }


    ruleBody(context: OSSRuleAst): OSSRuleBodyAst
    {

        let bodyStatement: Statement[] = [];

        let nextToken = this.lexer.peekNextToken();
        while (!this.isToken(MetaUITokenType.EOF) && !this.isToken(MetaUITokenType.RBrace)) {

            if (this.containsToken(KeyProperty) && nextToken.type === MetaUITokenType.Colon) {
                let key = this.currentToken.value;
                this.eat(KeyProperty);
                this.eat(MetaUITokenType.Colon);


                // let kv: OSSRuleBodyKeyValueAst = new OSSRuleBodyKeyValueAst()


            } else if (nextToken.type === MetaUITokenType.NextPrecedenceChain) {
                // predecessorChainNode zz => xxx

            } else {
                // then it must be selector parse rule
            }

        }


        return null;
    }

    value(): OSSRuleBodyKeyValueAst[]
    {


        return null;
    }

    selectorList(): OSSSelectorAst[]
    {
        let selectors: OSSSelectorAst[] = [];
        let selector: OSSSelectorAst;

        while ((selector = this.selector()) !== null) {
            selectors.push(selector);
        }
        if (selectors.length === 0) {
            this.error('no selectors');
        }
        return selectors;
    }

    traitList(): OSSTraitAst[]
    {
        if (this.isToken(MetaUITokenType.Hash)) {
            this.eat(MetaUITokenType.Hash);
            let traits = [];

            while (true) {
                if (this.isToken(MetaUITokenType.Coma)) {
                    this.eat(MetaUITokenType.Coma);
                } else if (this.isToken(MetaUITokenType.Identifier)) {
                    traits.push(new OSSTraitAst(this.currentToken.starts, this.currentToken.ends,
                        this.currentToken.value, this.currentToken.type));

                    this.eat(MetaUITokenType.Identifier);
                } else {
                    break;
                }
            }
            return traits;
        }
        return null;
    }

    selector(): OSSSelectorAst
    {
        let selector: OSSSelectorAst = new OSSSelectorAst(this.currentToken.starts);

        if (this.isToken(MetaUITokenType.At)) {
            selector.isDeclaration = true;
            this.eat(MetaUITokenType.At);
        }

        if (this.isToken(MetaUITokenType.NullMarker)) {
            selector.hasNullMarker = true;
            this.eat(MetaUITokenType.NullMarker);
            selector.selectorKey = this.selectorKey();

            selector.end = this.currentToken.ends;
            return selector;

        } else if (this.containsToken(KeyIdentifier)) {
            selector.selectorKey = this.selectorKey();

            if (this.isToken(MetaUITokenType.OpEq)) {
                this.eat(MetaUITokenType.OpEq);
                selector.selectorValue = this.selectorValue();
            } else {
                selector.selectorValue = new OSSSimpleValueAst(this.currentToken.starts,
                    this.currentToken.ends, '*', MetaUITokenType.Star);

            }
            selector.end = this.currentToken.ends;
            return selector;
        }

        return null;
    }

    private selectorKey(): OSSSelectorKeyAst
    {
        let key = new OSSSelectorKeyAst(this.currentToken.starts,
            this.currentToken.ends, this.currentToken.value, this.currentToken.type);

        this.eat(KeyIdentifier);
        return key;
    }

    private selectorValue(): OSSValueAst
    {
        if (this.containsToken(SimpleValue)) {
            return this.simpleValue();

        } else if (this.isToken(MetaUITokenType.LParen)) {
            this.eat(MetaUITokenType.LParen);
            let valueOrList = this.valueOrList();
            this.eat(MetaUITokenType.RParen);

            return valueOrList;
        }
        this.error('expected selectorValue');
    }


    private simpleValue(): OSSSimpleValueAst
    {
        let value = new OSSSimpleValueAst(this.currentToken.starts, this.currentToken.ends,
            this.currentToken.value, this.currentToken.type);

        this.eat(SimpleValue);
        return value;

    }

    private valueOrList(): OSSValueOrListValueAst
    {
        let values = [];
        let value;

        let start = this.currentToken.starts;
        while ((value = this.simpleValue()) !== null) {
            values.push(value);

            if (this.isToken(MetaUITokenType.Coma)) {
                this.eat(MetaUITokenType.Coma);
            } else if (this.isToken(MetaUITokenType.RParen)) {
                break;
            }
        }
        return new OSSValueOrListValueAst(start, this.currentToken.ends, values);
    }

    private listValue(): OSSValueAst
    {
        let listValue: OSSValueAst;

        if (this.containsToken(SimpleValue)) {
            listValue = this.simpleValue();

        } else if (this.isToken(MetaUITokenType.LBracket)) {
            this.eat(MetaUITokenType.LBracket);
            listValue = this.wrappedList();
            this.eat(MetaUITokenType.LBracket);

        } else if (this.isToken(MetaUITokenType.LBrace)) {
            this.eat(MetaUITokenType.LBrace);
            listValue = this.map();
            this.eat(MetaUITokenType.RBrace);
        }

        return listValue;
    }


    wrappedList(): OSSWrappedListValueAst
    {
        let list = [];
        let start = this.currentToken.starts - 1; // include just removed [
        while (!this.isToken(MetaUITokenType.EOF) && !this.isToken(MetaUITokenType.RBracket)) {
            list.push(this.listValue());
        }
        let end = this.currentToken.ends; // include just removed [
        return new OSSWrappedListValueAst(start, end, list);
    }

    map(): OSSMapValueAst
    {
        let map: OSSMapValueAst;
        while (!this.isToken(MetaUITokenType.EOF) && !this.isToken(MetaUITokenType.RBrace)) {

            if (this.containsToken(KeyProperty)) {
                let key = this.currentToken;
                this.eat(KeyProperty);
                this.eat(MetaUITokenType.Colon);


            } else {
                this.error('expecting key property');
            }
        }
        return map;
    }


    /**
     * compare the current token type with the passed token type and if they match then "eat" the
     * current token and move to the next one otherwise throw Error."
     *
     */
    private eat(tokenType: MetaUITokenType | MetaUITokenType[]): void
    {
        if (Array.isArray(tokenType) && this.containsToken(tokenType)) {
            this.currentToken = this.lexer.nextToken();
        } else if (this.isToken(<MetaUITokenType>tokenType)) {
            this.currentToken = this.lexer.nextToken();
        } else {

            let token = Array.isArray(tokenType) ? tokenType[0] : tokenType;
            this.error('Fail to parse. Expecting ' + MetaUITokenType[token]);
        }
    }


    private isToken(expected: MetaUITokenType): boolean
    {
        return this.currentToken.type === expected;
    }

    private containsToken(listOfTokens: MetaUITokenType[]): boolean
    {
        return listOfTokens.indexOf(this.currentToken.type) > -1;
    }

    private error(msg: string): void
    {
        throw new Error(`Parse error (${msg}): value: ${this.currentToken.value}, line: ${this.currentToken.line}, column: ${this.currentToken.column}`);
    }

}
