import PastWork from '#src/modules/past-work/past-work-model.js'

export const getPastWorkService = async(id) => {
    const pastWork = await PastWork.findById(id);
    console.log('in pastwork service pastWork= ', pastWork);
    return pastWork;
}

export const createNewPastWork = async(body) => {
    const newPastWork = await PastWork.create(body);

    return newPastWork;
}