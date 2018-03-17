var fortunCookies = [
    'Conquer you fears or they will conquer you.',
    'Rivers need springs.',
    'Do not fear what you don\'t konw',
    'You will have a pleasant surprise.',
    'Whenever possible ,keep it simple.'
];

exports.getFortune = function(){
    var idx = Math.floor(Math.random()*fortunCookies.length);
    return fortunCookies[idx];
};