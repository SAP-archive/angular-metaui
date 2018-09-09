import {async} from '@angular/core/testing';
import {MetaUILexer, MetaUIToken, MetaUITokenType} from '../../src/lang/metaui-lexer';


fdescribe('MetaUI Lexer', () =>
{
    let lexer: MetaUILexer;


    describe('Comments lexing', () =>
    {
        it('should tokenize block level comments as well as Line Comments', async(() =>
        {
            /* tslint:disable: no-trailing-whitespace */
            lexer = new MetaUILexer(`/** 
               some comment
            
            */ 
            
            
            /** 
               some comment 2
            
            */ 
             
            // Test Line Comment
            /**/
                                   
        `);

            debugger;
            let token: MetaUIToken = lexer.nextToken();
            expect(token.value).toBe(`/** 
               some comment
            
            */`);

            token = lexer.nextToken();
            expect(token.value).toBe(`/** 
               some comment 2
            
            */`);


            token = lexer.nextToken();
            expect(token.value.trim()).toBe(`// Test Line Comment`);


            token = lexer.nextToken();
            expect(token.value).toBe(`/**/`);

        }));


        it('should throw error when block comment is not terminated', async(() =>
        {
            lexer = new MetaUILexer(`
            /** 
               some comment
            
            */
            
            
            /** 
               some comment 2
            
                         
            // Test Line Comment
                        
        `);

            let token: MetaUIToken = lexer.nextToken();
            expect(() => lexer.nextToken())
                .toThrowError('Error while parsing: block comment is not correctly terminated');

        }));


        it('should throw error when line level comment is not terminated by new line', async(() =>
        {
            lexer = new MetaUILexer(`
            /** 
               some comment
            
            */
                               
            // Test Line Comment`);

            let token: MetaUIToken = lexer.nextToken();
            expect(() => lexer.nextToken())
                .toThrowError('Error while parsing: line comment is not correctly terminated');

        }));

    });

    describe('Common Symbols', () =>
    {

        it('should tokenize start and end of the basic block', async(() =>
        {

            lexer = new MetaUILexer(`            
                class=User#AAAA {
                    visible:true;               
                    zNone => aaa;                                                
                }                  
            `);

            let token = rewindTo(lexer, 6);

            expect(token.value).toBe('{');
            expect(token.type).toBe(MetaUITokenType.LBrace);

            token = rewindTo(lexer, 9);
            expect(token.value).toBe('}');
            expect(token.type).toBe(MetaUITokenType.RBrace);
        }));

        it('should tokenize start and end of the nested block', async(() =>
        {

            lexer = new MetaUILexer(`            
            class=User {
                
                
                layout=Inspect {
                }
                                                
            }                  
        `);
            let token = rewindTo(lexer, 4);

            expect(token.value).toBe('{');
            expect(token.type).toBe(MetaUITokenType.LBrace);

            token = rewindTo(lexer, 4);
            expect(token.value).toBe('{');
            expect(token.type).toBe(MetaUITokenType.LBrace);

            token = rewindTo(lexer, 1);
            expect(token.value).toBe('}');
            expect(token.type).toBe(MetaUITokenType.RBrace);

            token = rewindTo(lexer, 1);
            expect(token.value).toBe('}');
            expect(token.type).toBe(MetaUITokenType.RBrace);

        }));

        it('should tokenize start and end of the inline block', async(() =>
        {

            lexer = new MetaUILexer(`            
            class=User field=name {
                                                                                              
            }                  
        `);

            let token = rewindTo(lexer, 7);
            expect(token.value).toBe('{');
            expect(token.type).toBe(MetaUITokenType.LBrace);

            token = rewindTo(lexer, 1);
            expect(token.value).toBe('}');
            expect(token.type).toBe(MetaUITokenType.RBrace);

        }));

        it('should recognize Semi 2 colons', async(() =>
        {

            lexer = new MetaUILexer(`            
            class=User {
                field:value;
                field1:value2;
                                                                                              
            }                  
        `);

            let token = rewindTo(lexer, 8);
            expect(token.value).toBe(';');
            expect(token.type).toBe(MetaUITokenType.Semi);

            token = rewindTo(lexer, 4);
            expect(token.value).toBe(';');
            expect(token.type).toBe(MetaUITokenType.Semi);

        }));


        it('should tokenize key: value so it will read 2 colons', async(() =>
        {
            /* tslint:disable: no-trailing-whitespace */
            lexer = new MetaUILexer(`            
                    class=User {
                        field:value;
                        field1:value2;                                                         
                    }                  
                `);


            let token = rewindTo(lexer, 6);
            expect(token.value).toBe(':');
            expect(token.type).toBe(MetaUITokenType.Colon);

            token = rewindTo(lexer, 4);
            expect(token.value).toBe(':');
            expect(token.type).toBe(MetaUITokenType.Colon);


        }));


        it('should tokenize key: value so it will read 2 colons', async(() =>
        {

            lexer = new MetaUILexer(`            
                    class=User {
                        field=(aa, bb, cc) {
                        }                                                                     
                    }                  
                `);

            let token = rewindTo(lexer, 9);
            expect(token.value).toBe(',');
            expect(token.type).toBe(MetaUITokenType.Coma);

            token = rewindTo(lexer, 2);
            expect(token.value).toBe(',');
            expect(token.type).toBe(MetaUITokenType.Coma);

        }));


        it('should tokenize commans for aa, bb, cc ', async(() =>
        {
            lexer = new MetaUILexer(`            
                    class=User {
                        field=(aa, bb, cc) {
                        }                                                                     
                    }                  
                `);

            let token = rewindTo(lexer, 9);
            expect(token.value).toBe(',');
            expect(token.type).toBe(MetaUITokenType.Coma);

            token = rewindTo(lexer, 2);
            expect(token.value).toBe(',');
            expect(token.type).toBe(MetaUITokenType.Coma);

        }));


        it('should recognize Equal for the selectors', async(() =>
        {

            lexer = new MetaUILexer(`            
                        module=home class=User {
                                                                                      
                        }                  
                `);

            let token = rewindTo(lexer, 2);
            expect(token.value).toBe('=');
            expect(token.type).toBe(MetaUITokenType.OpEq);

            token = rewindTo(lexer, 3);
            expect(token.value).toBe('=');
            expect(token.type).toBe(MetaUITokenType.OpEq);
        }));


        it('should tokenize properties and precedenceChain path', async(() =>
        {
            lexer = new MetaUILexer(`
               // aaas
            
                class=User#AAAA {
                    visible:true;
                    
                    zNone => aaa;
                                                    
                }                      
            `);
            let token = rewindTo(lexer, 13);
            expect(token.value).toBe('=>');
            expect(token.type).toBe(MetaUITokenType.NextPrecedenceChain);
        }));

        it('should be able to tokenize boolean values', async(() =>
        {
            lexer = new MetaUILexer(
                'class=User { ' +
                'visible:true;  ' +
                'editable:false;  ' +
                '}'
            );

            let token = rewindTo(lexer, 7);
            expect(token.value).toBe('true');

            token = rewindTo(lexer, 4);
            expect(token.value).toBe('false');

        }));

    });


    describe('Reserved keyword identifies', () =>
    {

        it('should recognize 2 keywords', async(() =>
        {
            lexer = new MetaUILexer(`
               // aaas
            
                class=User#AAAA {
                    visible:true;                                                              
                }                      
            `);
            let token = rewindTo(lexer, 2);
            expect(token.value).toBe('class');
            expect(token.type).toBe(MetaUITokenType.KWClassIdentifier);


            token = rewindTo(lexer, 6);
            expect(token.value).toBe('visible');
            expect(token.type).toBe(MetaUITokenType.KWVisibleIdentifier);
        }));


        it('should recognize 1 keywords in nested structure', async(() =>
        {
            lexer = new MetaUILexer(`
               // aaas
            
                class=User {
                    field=name {
                        editable:true;
                    }                                                                          
            `);
            let token = rewindTo(lexer, 10);
            expect(token.value).toBe('editable');
            expect(token.type).toBe(MetaUITokenType.KWEditableIdentifier);
        }));


        it('should "User" a Generic Identifer', async(() =>
        {
            lexer = new MetaUILexer(`
               /* ss */
               
                class=User {
                    field=name {
                        editable:true;
                    }                                                                         
                }                      
            `);
            let token = rewindTo(lexer, 4);
            expect(token.value).toBe('User');
            expect(token.type).toBe(MetaUITokenType.Identifier);
        }));


    });

    describe('Expressions', () =>
    {

        it('should read expression literal with in properties section ', async(() =>
        {
            lexer = new MetaUILexer(
                'class=User {' +
                '    field=name { ' +
                '       editable:${object.visible}; ' +
                '       }' +
                '   }'
            );
            let token = rewindTo(lexer, 11);
            expect(token.value).toBe('object.visible');
            expect(token.type).toBe(MetaUITokenType.ExprLiteral);
        }));


        it('should read static dynamic expression ', async(() =>
        {
            lexer = new MetaUILexer(
                'class=User {' +
                '    field=name { ' +
                '       editable:$${object.visible; } ' +
                '       }' +
                '   }'
            );
            let token = rewindTo(lexer, 11);
            expect(token.value).toBe('object.visible;');
            expect(token.type).toBe(MetaUITokenType.ExprLiteralStaticDyn);
        }));


        it('should Throw Error when Expr does not start with $${  ', async(() =>
        {
            lexer = new MetaUILexer(
                'class=User { ' +
                'visible:$$object.aaa};  ' +
                '}'
            );

            expect(() => rewindTo(lexer, 7))
                .toThrowError('Error while parsing: Invalid Expression. Missing {');

        }));


    });

    describe('KeyPaths', () =>
    {

        it('should read zone based keypath ', async(() =>
        {
            lexer = new MetaUILexer(
                `class=User {
                    
                    
                       myForm.zTop => AAA.aaa; 
                   }`
            );
            let token = rewindTo(lexer, 5);
            expect(token.value).toBe('myForm.zTop');
            expect(token.type).toBe(MetaUITokenType.KeyPath);


            token = rewindTo(lexer, 2);
            expect(token.value).toBe('AAA.aaa');
            expect(token.type).toBe(MetaUITokenType.KeyPath);
        }));

    });

    describe('I18n Lokalization keys', () =>
    {
        it('should read zone based keypath ', async(() =>
        {
            lexer = new MetaUILexer(
                `class=User {
                    field=aa {
                        label:$[key001]"Default Value";  
                    }                                                              
              }`
            );
            let token = rewindTo(lexer, 11);
            expect(token.value).toBe('key001');
            expect(token.type).toBe(MetaUITokenType.I18nKey);

        }));

        it('should fail when bracket is not terminated ', async(() =>
        {
            lexer = new MetaUILexer(
                `class=User {
                    field=aa {
                        label:$[key001"Default Value";  
                    }                                                              
              }`
            );

            expect(() => rewindTo(lexer, 11))
                .toThrowError('Error while parsing: i18n key is not correctly terminated');

        }));
    });


    describe('String literals', () =>
    {

        it('should read default string translation that is after the key ', async(() =>
        {
            lexer = new MetaUILexer(
                `class=User {
                    field=aa {
                        label:$[key001]"Default Value";   
                    }                                                              
              }`
            );
            let token = rewindTo(lexer, 12);
            expect(token.value).toBe('Default Value');
            expect(token.type).toBe(MetaUITokenType.StringLiteral);

        }));


        it('should fail as string is not terminated ', async(() =>
        {
            lexer = new MetaUILexer(
                `class=User {
                            field=aa {
                                label:$[key001]"Default Value;   
                            }                                                              
                      }`
            );

            expect(() => rewindTo(lexer, 12))
                .toThrowError('Error while parsing: string literal is not correctly' +
                    ' terminated.');

        }));


        it('should read single quote string  ', async(() =>
        {
            lexer = new MetaUILexer(
                `class=User {
                    field=aa {
                        label:$[key001]'Default Value';   
                    }                                                              
              }`
            );
            let token = rewindTo(lexer, 12);
            expect(token.value).toBe('Default Value');
            expect(token.type).toBe(MetaUITokenType.StringLiteral);

        }));


        it('should fail as single q. string is not terminated ', async(() =>
        {
            lexer = new MetaUILexer(
                `class=User {
                            field=aa {
                                label:$[key001]'Default Value;   
                            }                                                              
                      }`
            );

            expect(() => rewindTo(lexer, 12))
                .toThrowError('Error while parsing: string literal is not correctly' +
                    ' terminated.');

        }));

        it('should fail as single q. string is is terminated with double q. ', async(() =>
        {
            lexer = new MetaUILexer(
                `class=User {
                            field=aa {
                                label:$[key001]'Default Value";   
                            }                                                              
                      }`
            );

            expect(() => rewindTo(lexer, 12))
                .toThrowError('Error while parsing: string literal is not correctly' +
                    ' terminated.');

        }));

    });

    describe('Dynamic field path bindings', () =>
    {

        it(' Read field path binding ', async(() =>
        {
            lexer = new MetaUILexer(
                `class=User {
                        field=aa {
                            value:$object;   
                        }                                                              
                 }`
            );

            let token = rewindTo(lexer, 11);
            expect(token.value).toBe('object');
            expect(token.type).toBe(MetaUITokenType.FieldPathBinding);

        }));


        it(' Read field path binding with dotted path  ', async(() =>
        {
            lexer = new MetaUILexer(
                `class=User {
                        field=aa {
                            value:$object.aa;   
                        }                                                              
                 }`
            );

            let token = rewindTo(lexer, 11);
            expect(token.value).toBe('object.aa');
            expect(token.type).toBe(MetaUITokenType.FieldPathBinding);

        }));


        it('Read field path binding with numbers path  ', async(() =>
        {
            lexer = new MetaUILexer(
                `class=User {
                        field=aa {
                            value:$object12.aa;   
                        }                                                              
                 }`
            );
            let token = rewindTo(lexer, 11);
            expect(token.value).toBe('object12.aa');
            expect(token.type).toBe(MetaUITokenType.FieldPathBinding);

        }));


        it('should fail if it does not start with "a"-"z","A"-"Z","_"', async(() =>
        {
            lexer = new MetaUILexer(
                `class=User {
                        field=aa {
                            value:$1object12.aa;   
                        }                                                              
                 }`
            );
            let token = rewindTo(lexer, 11);
            expect(token.type).toBe(MetaUITokenType.EOF);

        }));


    });

});


export function rewindTo(lexer: MetaUILexer, numOfSteps: number)
{
    let token;
    for (let i = 0; i < numOfSteps; i++) {
        token = lexer.nextToken();
    }

    return token;
}
