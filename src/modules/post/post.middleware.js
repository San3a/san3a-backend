export const setPostBody = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};
