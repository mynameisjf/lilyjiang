package com.jiangf.util;

import java.util.EnumSet;

/**
 * @备注:常用符号枚举类
 */
public enum Symbol {
    EMPTY(' '),
    AT('@'),
    DOLLAR_SIGN('$'),       //美元 u0024
    PERCENT('%'),           //百分号 u0025
    POINT('.'),             //点 u002E
    CARET('^'),             //乖方 u005E
    OPEN_BRACE('{'),        //左大括号 u007B
    CLOSE_BRACE('}'),       //右大括号
    OPEN_PARENTHESIS('('),  //左圆括号 u0028
    CLOSE_PARENTHESIS(')'), //右圆括号 u0029
    OPEN_BRACKET('['),      //左方括号 u005B
    CLOSE_BRACKET(']'),     //右方括号
    VERTICAL_LINE('|'),     //竖线 u007C
    ASTERISK('*'),          //星号 u002A
    PLUS('+'),              //加号 u002B
    QUESTION_MARK('?'),     //问号 u003F
    ;


    private char symbol;//符号

    Symbol(char symbol) {
        this.symbol = symbol;
    }

    public String getUnicode() {
        return StringConvert.convertUnicode(Character.toString(symbol));
    }

    public int getASCII() {
        return Integer.valueOf(symbol);
    }

    public char getSymbol() {
        return symbol;
    }

    public static void main(String[] args) {
        EnumSet<Symbol> stateSet = EnumSet.allOf(Symbol.class);
        for (Symbol s : stateSet) {
            System.out.println(s.getSymbol() + "==>" + s.getUnicode() + "==>" + s.getASCII());
        }
    }
}
