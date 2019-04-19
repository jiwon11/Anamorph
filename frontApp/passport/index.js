const local = require('./localStrategy');
const { User } = require('../models');

module.exports = (passport ) => {
    passport.serializeUser((user, done) => { 
        done(null, user.id);
    });
    /*
    serializeUser : req.session 객체에 어떤 데이터를 저장할지 선택
    매개변수로 user를 받아 done함수에 두 번째 인자로 user.id를 넘김.
    세션에 사용자 정보 모두를 저장할 수 없으므로 사용자 아이디만 저장
    => 사용자 정보 객체를 세션에 아이디로 저장
    */

    passport.deserializeUser((id, done) => {
        User.findOne({
            where : { id },
            include : [{
                model : User,
                attributes : ['id', 'username','img'],
                as : 'Followers',
            }, {
                model : User,
                attributes : ['id', 'username','img'],
                as : 'Followings',
            }],
        })
        .then(user => done(null, user))
        .catch(err => done(err));
    });
    /*
    deserializeUser : 매 요청 시 실행
    passport.session() 미들웨어가 이 메서드를 호출 
    serializeUser에서 세션에 저장했던 아이디를 받아 데이터베이스에서 사용자 정보를 조회
    조회한 정보를 req.user에 저장
    req.user를 통해 로그인한 사용자의 정보를 가져올 수 있음.
    => 세션에 저장한 아이디를 통해 사용자 정보 객체를 불러오는 것
    */

    local(passport);
};