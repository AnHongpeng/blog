// 类，可以应用接口。这要求类的实例要与 interface 相匹配
var User = /** @class */ (function () {
    function User() {
        this.name = '小安';
    }
    User.prototype.say = function () {
        return 'hello';
    };
    return User;
}());
var getPersonName = function (person) {
    console.log(person.name);
};
var setPersonName = function (person, name) {
    person.name = name; // 这里就会报错，因为 name 属性设成的是只读
};
var person = {
    name: '小安',
    sex: 'male',
    say: function () {
        return 'say hello';
    },
    teach: function () {
        return 'teach';
    }
};
getPersonName(person);
setPersonName(person, '源宝');
getPersonName({
    name: '小安',
    sex: 'male',
    say: function () {
        return 'say hello';
    }
});
var say = function (word) {
    return word;
};
