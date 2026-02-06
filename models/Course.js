import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({

    title: {
        type: String,
        trim: true,
        required: [true, `Please add a course title`]
    },

    description: {
        type: String,
        required: [true, `Please add a description`]
    },

    weeks: {
        type: String,
        required: [true, `Please add number of weeks`]
    },

    tuition: {
        type: Number,
        required: [true, `Please add a tuition cost`]
    },

    minimumSkill: {
        type: String,
        required: [true, `Please add a tuition cost`],
        enum: ['beginner', 'intermediate', 'advanced']
    },

    scholarshipAvailables: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    }

});

CourseSchema.statics.getAverageCost = async function (bootcampId) {

    console.log("AverageCost Calculating");
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: { $avg: '$tuition' }
            }
        }
    ]);
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, { averageCost: Math.ceil(obj[0].averageCost / 10) * 10 });
    } catch (error) {
        console.log(error);
    }
}



//  Call getAverageCost after save
CourseSchema.post('save', function () {
    this.constructor.getAverageCost(this.bootcamp);
});
//  Call getAverageCost before delete
CourseSchema.post('deleteOne', { document: true, query: false }, function () {
    this.constructor.getAverageCost(this.bootcamp);
}
);



export default mongoose.model("Course", CourseSchema);