export const setPostBody = (req, res, next) => {
    req.body = { ...req.body, user: req.user.id };
    next();
};

export const setUserIdToParams = (req, res, next) => {
    req.params = { ...req.params, userId: req.user._id };
    next();
};
