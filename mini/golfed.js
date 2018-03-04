d=(a,b=a.shift())=>/\w+'*/.test(b)&&b||/\(\\|\(λ/.test(b)&&{x:a.shift(),a:d(a)}||{a:d(a),b:d(a)};
e=a=>a.a&&a.b?f(g(e(a.a)),a.b):a;
g=a=> a.a&&a.b&&f(g(e(a.a)),g(e(a.b)))||a.a&&{x:a.x,a:g(e(a.a))}||a;
f=(a,b,c={})=>a.x&&a.a?g(e(h((c[a.x]=b,c),a.a))):{a:a, b:b};
h=(a,b,c,m={})=>{
    if(!(c=b.a&&b.b&&{a:h(a,b.a),b:h(a,b.b)})&&(c=b.a)){
        for(c=b.x;k(a[Object.keys(a)[0]],c);){c+="'";}c={x:c, a:h(a, h((m[b.x] = c, m), b.a))};
    }return c||a[b]||b;}
k=(a,b)=>a.a&&a.b&&(k(a.a, b)||k(a.b,b))||a.a&&k(a.a,b)||a===b;
l=a=>a.a&&a.b&&"("+l(a.a)+" "+l(a.b)+")"||a.a&&"(λ "+l(a.x)+". "+l(a.a)+")"||a;
module.exports.calc=a=>l(g(e(d(a.match(/\(\\|\(λ|\.|\(|\)|\w+'*|\s+/g).filter(a=>!/\.|\s+|\)/.test(a))))));