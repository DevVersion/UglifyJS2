reduce_vars: {
    options = {
        conditionals  : true,
        evaluate      : true,
        global_defs   : {
            C : 0
        },
        reduce_vars   : true,
        unused        : true
    }
    input: {
        var A = 1;
        (function f0() {
            var a = 2;
            console.log(a - 5);
            console.log(A - 5);
        })();
        (function f1() {
            var a = 2;
            console.log(a - 5);
            eval("console.log(a);");
        })();
        (function f2(eval) {
            var a = 2;
            console.log(a - 5);
            eval("console.log(a);");
        })(eval);
        (function f3() {
            var b = typeof C !== "undefined";
            var c = 4;
            if (b) {
                return 'yes';
            } else {
                return 'no';
            }
        })();
        console.log(A + 1);
    }
    expect: {
        var A = 1;
        (function() {
            console.log(-3);
            console.log(-4);
        })();
        (function f1() {
            var a = 2;
            console.log(-3);
            eval("console.log(a);");
        })();
        (function f2(eval) {
            var a = 2;
            console.log(-3);
            eval("console.log(a);");
        })(eval);
        (function() {
            return "yes";
        })();
        console.log(2);
    }
}

modified: {
    options = {
        conditionals  : true,
        evaluate      : true,
        reduce_vars   : true,
        unused        : true
    }
    input: {
        function f0() {
            var a = 1, b = 2;
            b++;
            console.log(a + 1);
            console.log(b + 1);
        }

        function f1() {
            var a = 1, b = 2;
            --b;
            console.log(a + 1);
            console.log(b + 1);
        }

        function f2() {
            var a = 1, b = 2, c = 3;
            b = c;
            console.log(a + b);
            console.log(b + c);
            console.log(a + c);
            console.log(a + b + c);
        }

        function f3() {
            var a = 1, b = 2, c = 3;
            b *= c;
            console.log(a + b);
            console.log(b + c);
            console.log(a + c);
            console.log(a + b + c);
        }

        function f4() {
            var a = 1, b = 2, c = 3;
            if (a) {
                b = c;
            } else {
                c = b;
            }
            console.log(a + b);
            console.log(b + c);
            // TODO: as "modified" is determined in "figure_out_scope",
            // even "passes" wouldn't improve this any further
            console.log(a + c);
            console.log(a + b + c);
        }

        function f5(a) {
            B = a;
            console.log(A ? 'yes' : 'no');
            console.log(B ? 'yes' : 'no');
        }
    }
    expect: {
        function f0() {
            var b = 2;
            b++;
            console.log(2);
            console.log(b + 1);
        }

        function f1() {
            var b = 2;
            --b;
            console.log(2);
            console.log(b + 1);
        }

        function f2() {
            var a = 1, b = 2, c = 3;
            b = c;
            console.log(a + b);
            console.log(b + c);
            console.log(4);
            console.log(a + b + c);
        }

        function f3() {
            var a = 1, b = 2, c = 3;
            b *= c;
            console.log(a + b);
            console.log(b + c);
            console.log(4);
            console.log(a + b + c);
        }

        function f4() {
            var a = 1, b = 2, c = 3;
            b = c;
            console.log(a + b);
            console.log(b + c);
            console.log(a + c);
            console.log(a + b + c);
        }

        function f5(a) {
            B = a;
            console.log(A ? 'yes' : 'no');
            console.log(B ? 'yes' : 'no');
        }
   }
}

unsafe_evaluate: {
    options = {
        evaluate     : true,
        reduce_vars  : true,
        unsafe       : true,
        unused       : true
    }
    input: {
        function f0(){
            var a = {
                b:1
            };
            console.log(a.b + 3);
        }

        function f1(){
            var a = {
                b:{
                    c:1
                },
                d:2
            };
            console.log(a.b + 3, a.d + 4, a.b.c + 5, a.d.c + 6);
        }
    }
    expect: {
        function f0(){
            console.log(4);
        }

        function f1(){
            var a = {
                b:{
                    c:1
                },
                d:2
            };
            console.log(a.b + 3, 6, 6, 2..c + 6);
        }
    }
}

unsafe_evaluate_object: {
    options = {
        evaluate     : true,
        reduce_vars  : true,
        unsafe       : true
    }
    input: {
        function f0(){
            var a = 1;
            var b = {};
            b[a] = 2;
            console.log(a + 3);
        }

        function f1(){
            var a = {
                b:1
            };
            a.b = 2;
            console.log(a.b + 3);
        }
    }
    expect: {
        function f0(){
            var a = 1;
            var b = {};
            b[a] = 2;
            console.log(4);
        }

        function f1(){
            var a = {
                b:1
            };
            a.b = 2;
            console.log(a.b + 3);
        }
    }
}

unsafe_evaluate_array: {
    options = {
        evaluate     : true,
        reduce_vars  : true,
        unsafe       : true
    }
    input: {
        function f0(){
            var a = 1;
            var b = [];
            b[a] = 2;
            console.log(a + 3);
        }

        function f1(){
            var a = [1];
            a[2] = 3;
            console.log(a.length);
        }

        function f2(){
            var a = [1];
            a.push(2);
            console.log(a.length);
        }
    }
    expect: {
        function f0(){
            var a = 1;
            var b = [];
            b[a] = 2;
            console.log(4);
        }

        function f1(){
            var a = [1];
            a[2] = 3;
            console.log(a.length);
        }

        function f2(){
            var a = [1];
            a.push(2);
            console.log(a.length);
        }
    }
}

unsafe_evaluate_equality: {
    options = {
        evaluate     : true,
        reduce_vars  : true,
        unsafe       : true,
        unused       : true
    }
    input: {
        function f0(){
            var a = {};
            console.log(a === a);
        }

        function f1(){
            var a = [];
            console.log(a === a);
        }

        function f2(){
            var a = {a:1, b:2};
            var b = a;
            var c = a;
            console.log(b === c);
        }

        function f3(){
            var a = [1, 2, 3];
            var b = a;
            var c = a;
            console.log(b === c);
        }
    }
    expect: {
        function f0(){
            console.log(true);
        }

        function f1(){
            console.log(true);
        }

        function f2(){
            console.log(true);
        }

        function f3(){
            console.log(true);
        }
    }
}
