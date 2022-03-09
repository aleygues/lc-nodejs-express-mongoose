const WilderModel = require('./../models/Wilder');

const controller = {};

controller.findAll = async (req, res) => {
    const wilders = await WilderModel.find({});
    res.json(wilders);
};

controller.findOne = async (req, res) => {
    const wilder = await WilderModel.findById(req.params.id);
    res.json(wilder);
};

controller.delete = async (req, res) => {
    const wilder = await WilderModel.findById(req.params.id);
    await wilder.remove();
    res.json(wilder);
};

// req = request, res = response
controller.update = async (req, res) => {
    const wilder = await WilderModel.findById(req.params.id);
    console.log(wilder);
    if (wilder) {
        wilder.name = req.body.name;
        wilder.city = req.body.city;
        wilder.skills = req.body.skills;

        await wilder.save();
        res.json(wilder);
    } else {
        res.status(404).json({ message: 'not_found' });
    }
};

controller.partialUpdate = async (req, res) => {
    const wilder = await WilderModel.findById(req.params.id);
    console.log(wilder);
    if (wilder) {
        Object.assign(wilder, req.body);
        await wilder.save();
        res.json(wilder);
    } else {
        res.status(404).json({ message: 'not_found' });
    }
};

controller.create = async (req, res, next) => {
    try {
        await WilderModel.init();
        const newWilder = new WilderModel(req.body);
        const result = await newWilder.save();
        res.json(result);
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ message: 'Name already taken' });
        }
        throw err;
    }
};

module.exports = controller;