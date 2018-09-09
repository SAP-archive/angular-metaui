import {MetaUILexer, MetaUITokenType} from '../../src/lang/metaui-lexer';
import {MetaUIParser} from '../../src/lang/metaui-parser';
import {
    OSSRuleAst,
    OSSSelectorKeyAst,
    OSSSimpleValueAst,
    OSSTraitAst,
    OSSValueOrListValueAst
} from '../../src/lang/metaui-ast';


describe('MetaUI parser', () =>
{
    let lexer: MetaUILexer;


    describe('Selectors', () =>
    {
        it('parses simple selector with key=class and value=User and has correct token types',
            () =>
            {
                /* tslint:disable: no-trailing-whitespace */
                lexer = new MetaUILexer(`
                    class=User;                   
                `);

                let parser = new MetaUIParser(lexer);
                let ossFileAst = parser.parse();

                let rules = ossFileAst.rules;
                expect(rules.length).toBe(1);

                let rule: OSSRuleAst = rules[0];
                expect(rule.selectorList.length).toBe(1);

                expect(rule.selectorList[0].hasNullMarker).toBeFalsy();
                expect(rule.selectorList[0].isDeclaration).toBeFalsy();
                let selectorKey: OSSSelectorKeyAst = rule.selectorList[0].selectorKey;
                expect(selectorKey.identifierKey).toBe('class');
                expect(selectorKey.nodeType).toBe(MetaUITokenType.KWClassIdentifier);

                let selectorValue: OSSSimpleValueAst =
                    <OSSSimpleValueAst> rule.selectorList[0].selectorValue;
                expect(selectorValue.value).toBe('User');
            });


        it('should parse inlined selectors role=admin class=User',
            () =>
            {

                lexer = new MetaUILexer(`
                    role=admin class=User;                   
                `);

                let parser = new MetaUIParser(lexer);
                let ossFileAst = parser.parse();

                let rules = ossFileAst.rules;
                expect(rules.length).toBe(1);

                let rule: OSSRuleAst = rules[0];
                let rule2: OSSRuleAst = rules[1];
                expect(rule.selectorList.length).toBe(2);
                let selector1 = rule.selectorList[0];
                let selector2 = rule.selectorList[1];
                expect(selector1.selectorKey.identifierKey).toBe('role');
                expect(selector1.selectorValue.value).toBe('admin');

                expect(selector2.selectorKey.identifierKey).toBe('class');
                expect(selector2.selectorValue.value).toBe('User');
            });


        it('should throw exception if missing comma ',
            () =>
            {

                lexer = new MetaUILexer(`
                    role=admin class=User                   
                `);

                let parser = new MetaUIParser(lexer);

                expect(() => parser.parse()).toThrowError(/Expecting Semi\)/);
            });


        it('parse selector declaration ', () =>
        {

            lexer = new MetaUILexer(`
                    class=User @field=test;                   
                `);

            let parser = new MetaUIParser(lexer);
            let ossFileAst = parser.parse();

            let rules = ossFileAst.rules;
            let selector = rules[0].selectorList[1];
            expect(selector.isDeclaration).toBeTruthy();
            expect(selector.selectorKey.identifierKey).toBe('field');
            expect(selector.selectorValue.value).toBe('test');
        });


        it('parse null marker with identifier ', () =>
        {

            lexer = new MetaUILexer(`
                    ~class;                   
                `);

            let parser = new MetaUIParser(lexer);
            let ossFileAst = parser.parse();

            let rules = ossFileAst.rules;
            let selector = rules[0].selectorList[0];
            expect(selector.hasNullMarker).toBeTruthy();
            expect(selector.selectorKey.identifierKey).toBe('class');
        });


        it('should recognize unqualified key selectors *  ', () =>
        {

            lexer = new MetaUILexer(`
                    class field;                   
                `);

            let parser = new MetaUIParser(lexer);
            let ossFileAst = parser.parse();

            let rules = ossFileAst.rules;
            let selector = rules[0].selectorList[0];
            expect(selector.selectorKey.identifierKey).toBe('class');
            expect(selector.selectorValue.value).toBe('*');


            selector = rules[0].selectorList[1];
            expect(selector.selectorKey.identifierKey).toBe('field');
            expect(selector.selectorValue.value).toBe('*');
        });


        it('should parse selector s traits #required', () =>
        {

            lexer = new MetaUILexer(`
                    class=test#required;                   
                `);

            let parser = new MetaUIParser(lexer);
            let ossFileAst = parser.parse();

            let rules = ossFileAst.rules;
            let selector = rules[0].selectorList[0];
            expect(selector.selectorKey.identifierKey).toBe('class');
            expect(selector.selectorValue.value).toBe('test');

            let trait: OSSTraitAst = rules[0].traitList[0];
            expect(trait.identifier).toBe('required');
        });


        it('should parse selector with traits #required,bold', () =>
        {

            lexer = new MetaUILexer(`
                    class=test#required,bold;                   
                `);

            let parser = new MetaUIParser(lexer);
            let ossFileAst = parser.parse();

            let rules = ossFileAst.rules;
            let selector = rules[0].selectorList[0];
            expect(selector.selectorKey.identifierKey).toBe('class');
            expect(selector.selectorValue.value).toBe('test');

            let traitList: OSSTraitAst[] = rules[0].traitList;
            expect(traitList[0].identifier).toBe('required');
            expect(traitList[1].identifier).toBe('bold');
        });


        it('should parse unqualified selector with trait #required', () =>
        {

            lexer = new MetaUILexer(`
                    class#required,bold;                   
                `);

            let parser = new MetaUIParser(lexer);
            let ossFileAst = parser.parse();

            let rules = ossFileAst.rules;
            let selector = rules[0].selectorList[0];
            expect(selector.selectorKey.identifierKey).toBe('class');
            expect(selector.selectorValue.value).toBe('*');

            let traitList: OSSTraitAst[] = rules[0].traitList;
            expect(traitList[0].identifier).toBe('required');
            expect(traitList[1].identifier).toBe('bold');
        });


        it('should read List of values in form operation=(view,edit)', () =>
        {

            lexer = new MetaUILexer(`
                    operation=(view,edit);                   
                `);

            let parser = new MetaUIParser(lexer);
            let ossFileAst = parser.parse();

            let rules = ossFileAst.rules;
            let selector = rules[0].selectorList[0];
            expect(selector.selectorKey.identifierKey).toBe('operation');

            let listValue: OSSValueOrListValueAst = selector.selectorValue;
            expect(listValue.value[0].value).toBe('view');
            expect(listValue.value[1].value).toBe('edit');
        });


        it('should read List of values in form operation=(view,edit) for nested form', () =>
        {

            lexer = new MetaUILexer(`
                    class=user operation=(view,edit);                   
                `);

            let parser = new MetaUIParser(lexer);
            let ossFileAst = parser.parse();

            let rules = ossFileAst.rules;
            let selector = rules[0].selectorList[1];
            expect(selector.selectorKey.identifierKey).toBe('operation');

            let listValue: OSSValueOrListValueAst = selector.selectorValue;
            expect(listValue.value[0].value).toBe('view');
            expect(listValue.value[1].value).toBe('edit');
        });


        it('should support string literal as selector value', () =>
        {

            lexer = new MetaUILexer(`
                    class='Test';                   
                `);

            let parser = new MetaUIParser(lexer);
            let ossFileAst = parser.parse();

            let rules = ossFileAst.rules;
            let selector = rules[0].selectorList[0];

            let value: OSSSimpleValueAst = selector.selectorValue;
            expect(value.nodeType).toBe(MetaUITokenType.StringLiteral);

        });


        it('should support Integer  as selector value', () =>
        {
            lexer = new MetaUILexer(`
                    class=1;                   
                `);

            let parser = new MetaUIParser(lexer);
            let ossFileAst = parser.parse();

            let rules = ossFileAst.rules;
            let selector = rules[0].selectorList[0];

            let value: OSSSimpleValueAst = selector.selectorValue;
            expect(value.nodeType).toBe(MetaUITokenType.IntLiteral);

        });


        it('should support float  as selector value', () =>
        {
            lexer = new MetaUILexer(`
                    class=12.22;                   
                `);

            let parser = new MetaUIParser(lexer);
            let ossFileAst = parser.parse();

            let rules = ossFileAst.rules;
            let selector = rules[0].selectorList[0];

            let value: OSSSimpleValueAst = selector.selectorValue;
            expect(value.nodeType).toBe(MetaUITokenType.FltLiteral);
        });

        it('should support keyPath  as selector value', () =>
        {
            lexer = new MetaUILexer(`
                    class=aa.aas;                   
                `);
            let parser = new MetaUIParser(lexer);
            let ossFileAst = parser.parse();

            let rules = ossFileAst.rules;
            let selector = rules[0].selectorList[0];

            let value: OSSSimpleValueAst = selector.selectorValue;
            expect(value.nodeType).toBe(MetaUITokenType.KeyPath);

        });


        it('should support boolean TRUE  as selector value', () =>
        {
            lexer = new MetaUILexer(`
                    class=true;                   
                `);

            let parser = new MetaUIParser(lexer);
            let ossFileAst = parser.parse();

            let rules = ossFileAst.rules;
            let selector = rules[0].selectorList[0];

            let value: OSSSimpleValueAst = selector.selectorValue;
            expect(value.nodeType).toBe(MetaUITokenType.BOOLTRue);

        });


        it('should support boolean FALSE  as selector value', () =>
        {
            lexer = new MetaUILexer(`
                    class=false;                   
                `);

            let parser = new MetaUIParser(lexer);
            let ossFileAst = parser.parse();

            let rules = ossFileAst.rules;
            let selector = rules[0].selectorList[0];

            let value: OSSSimpleValueAst = selector.selectorValue;
            expect(value.nodeType).toBe(MetaUITokenType.BOOLFalse);

        });


        it('should support NULL  as selector value', () =>
        {
            lexer = new MetaUILexer(`
                    class=null;                   
                `);
            let parser = new MetaUIParser(lexer);
            let ossFileAst = parser.parse();

            let rules = ossFileAst.rules;
            let selector = rules[0].selectorList[0];

            let value: OSSSimpleValueAst = selector.selectorValue;
            expect(value.nodeType).toBe(MetaUITokenType.Null);

        });

    });


});
