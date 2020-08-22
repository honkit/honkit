declare namespace jest {
    interface Matchers<R> {
        toHaveFile: any;
        toHaveDOMElement: any;
    }

    interface Expect {
        toHaveFile: any;
        toHaveDOMElement: any;
    }

    interface InverseAsymmetricMatchers {
        toHaveFile: any;
        toHaveDOMElement: any;
    }
}
