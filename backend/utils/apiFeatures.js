class ApiFeatures{
    constructor(query,queryString){
        this.query = query; 
        this.queryString = queryString;
    }
    search(){
        const keyword = this.queryString.keyword ?
        {
            name:{
                $regex : this.queryString.keyword,
                $options:"i",  //for all small and capital letters
            },

        }:{};
      

        this.query = this.query.find({ ...keyword });
        return this
    }
    filter(){
        const queryCopy = {...this.queryString}
       console.log("not updated",queryCopy)
        const removeFields=["keyword", "page","limit"]
        removeFields.forEach((key)=> delete queryCopy[key])

        // filter with price parameter

        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
        this.query = this.query.find(JSON.parse(queryStr)); // product.find.find(based on price)
       
        // console.log("updated",queryStr)
        return this;
    }
    pagination() {
        const currentPage = Number(this.queryString.page)|| 1;
        // console.log("pagination",this.queryString.page)
        const skipPage = this.queryString.limit * (currentPage-1)
        this.query= this.query.limit(this.queryString.limit).skip(skipPage); //this.qurey is product find method
        // console.log("paginated",this.query)
        return this;
    }

    limitPerPage() {
        const pageLimit = Number(this.queryString.limit)|| 0;
        this.query = this.query.limit(pageLimit); //
        return this;
    }
}

module.exports = ApiFeatures