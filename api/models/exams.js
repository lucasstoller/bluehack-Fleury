const mongoose = require('mongoose');
const slugify = require('slugify');

// CONNECT TO DB
mongoose.connect('mongodb://localhost/bluehack_fleury')
    .then(() => console.log('Connected to mongodb.'))
    .catch(err => console.log('Could not connect to mongodb... \n', err));

// CREATING A SCHEMA FOR exam MODEL
const examSchema = new mongoose.Schema({
    name: String,
    tags: [ String ],
    slug: String,
    createdAt: { type: Date, default: Date.now },
});

// CREATING THE EXAM MODEL WITH EXAM SCHEMA
const Exam = mongoose.model('exam', examSchema);

async function getAllExams(query){
    if(query == null) return await Exam.find();
    else {
        const filters = query.split(' ');
        return await Exam.find({
            tags: { $in: filters }
        })
    }
}

async function getExam(slug){
    return await Exam.findOne({slug: slug});
}

async function createExam({name, tags}){
    const slug = slugify(name);
    
    // INSTANCING A COURSE OBJECT
    const exam = new Exam({
        name,
        tags,
        slug,
    });

    const exams = await Exam.count({slug: slug});
    if(exams) return;

    // SAVING INTO DATABASE
    const result = await exam.save();
    return result;
}

async function updateExam({slug, name, tags}){
    const exam =  await getExam(slug);
    if(!exam) return;

    exam.name = name;
    exam.tags = tags;

    const result = await exam.save();
    return result;
}

async function deleteExam(id){
    const course = await Exam.findByIdAndRemove(id);
    return course;
}

module.exports.get = getExam;
module.exports.getAll = getAllExams;
module.exports.create = createExam;
module.exports.update = updateExam;
module.exports.delete = deleteExam;
