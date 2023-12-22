const passport = require("passport");
const User = require("./modals/userModal");

const LocalStrategy = require("passport-local").Strategy

exports.initializingPassport = () => {
    passport.use(new LocalStrategy(
        async (username, password, done) => {
            try {
                const user = await User.findOne({username});
                if(!user) return done(null,false)
                if(user.password != password) return done(null,false)
                return done(null,user)
            } catch (error) {
                return done(error,false)
            }
        }
      ));

      passport.serializeUser((user,done)=>{
            done(null,user.id)
      })

      passport.deserializeUser(async (id,done)=>{
        try {
            const user = await User.findById(id)

            return done(null,user)
        } catch (error) {
            return done(error,false)
        }
      })
}