"use strict";

//========================== Class Definitions Start =====================

class BaseDao {
    constructor(dbModel) {
        //Get Model
        this.Model = dbModel;
    }

    save(object) {
        return this.Model.create(object);
    }

    findOne(query, projection) {
        return this.Model.findOne(query, projection).exec();
    }

    find(query, projection) {
        return this.Model.find(query, projection).exec();
    }

    findByPagination(query, projection, pageData) {
        return this.Model.find(query, projection).skip(pageData.pageOffset).limit(pageData.limitPage).exec();
    }

    findOneAndUpdate(query, update, options) {
        return this.Model.findOneAndUpdate(query, update, options).exec();
    }

    findAndModify(query, update, options) {
        return this.Model.findAndModify(query, update, options).exec();
    }

    /**
     * Update Given Model
     * @param query
     * @param toUpdate
     * @return Promise Object
     * @private
     */
    update(query, update, options) {
        if (!options) {
            options = {}
        }
        return this.Model.update(query, update, options).exec();
    }

    remove(query, options) {
        if (!options) {
            options = {}
        }
        return this.Model.remove(query, options).exec();
    }

    findByIdAndRemove(query, options) {
        return this.Model.findByIdAndRemove(query, options).exec();
    }

    aggregate(aggPipe) {
        return this.Model.aggregate(aggPipe).exec();
    }

    count(query, options) {
        return this.Model.count(query, options).exec();
    }

}
//========================== Class Definitions End =====================


//========================== Helper methods start =======================

//========================== Helper methods end =======================

//========================== Export module start =======================

module.exports = BaseDao;

//========================== Export module End =======================
