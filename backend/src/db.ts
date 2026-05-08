import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const contentTypes = ["image", "audio", "video", "article", "tweet", "document", "link", "other"];
const roleBasedAccess = ["user", "admin"];

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: roleBasedAccess, required: true }
}, { timestamps: true })

const TagSchema = new Schema({
    title: { type: String, required: true, unique: true }
})

const UserModel = mongoose.model('users', UserSchema);
const TagModel = mongoose.model('tags', TagSchema);

const ContentSchema = new Schema({
    link: { type: String, required: true },
    type: { type: String, enum: contentTypes, required: true },
    title: { type: String, required: true },
    tags: [{ type: ObjectId, ref: 'tags' }],
    userId: { type: ObjectId, ref: 'users', required: true }
}, { timestamps: true })

const LinkSchema = new Schema({
    hash: { type: String, required: true, unique: true },
    userId: { type: ObjectId, ref: 'users', required: true }
})

const ContentModel = mongoose.model('contents', ContentSchema);
const LinkModel = mongoose.model('links', LinkSchema);

export {
    UserModel, TagModel, ContentModel, LinkModel
};