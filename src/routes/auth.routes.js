import express  from "express";

const router=express.Router()
router.post('/sign-up',(req,res)=>{
    res.send('POST /api/auth/sign-up resposne')

})
router.post('/sign-in', (req, res) => {
  res.send('POST /api/auth/sign-in resposne');
});
router.post('/sign-out', (req, res) => {
  res.send('POST /api/auth/sign-out resposne');
});


export default router