//// SESSIONS IN TABLE 'lockersDB.sessions'
const tgUserSchema = ({
    status: String,
    id : Number,
    winlogin: String,
    bookedLocker: Number,
    lastViewedBlock: {
        level: Number,
        position: Number
    }
  
});