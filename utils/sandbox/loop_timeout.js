"use strict";

function transform(babel) {

  const t = babel.types;
  return {
    visitor: {
      Program: function timerDecl(path) {

        this.varName = path.scope.generateUidIdentifier("timer");
        path.scope.push({ id: this.varName, init: t.callExpression(t.memberExpression(t.identifier("Date"), t.identifier("now")), []) });
      },
      WhileStatement: function transformWhile(path) {

        if (t.isEmptyStatement(path.node.body)) {

          path.get("body").replaceWith(t.blockStatement([]));
        }

        path.get("body").unshiftContainer("body", t.ifStatement(t.binaryExpression(">", t.callExpression(t.memberExpression(t.identifier("Date"), t.identifier("now")), []), t.parenthesizedExpression(t.binaryExpression("+", this.varName, t.numericLiteral(2000)))), t.throwStatement(t.stringLiteral("Execution Timeout")), null));
      },
      ForStatement: function transformFor(path) {

        if (t.isEmptyStatement(path.node.body)) {

          path.get("body").replaceWith(t.blockStatement([]));
        }

        path.get("body").unshiftContainer("body", t.ifStatement(t.binaryExpression(">", t.callExpression(t.memberExpression(t.identifier("Date"), t.identifier("now")), []), t.parenthesizedExpression(t.binaryExpression("+", this.varName, t.numericLiteral(2000)))), t.throwStatement(t.stringLiteral("Execution Timeout")), null));
      }
    }
  };
}

module.exports = transform;
