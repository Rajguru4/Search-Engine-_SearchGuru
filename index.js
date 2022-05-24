//Required modules
const express = require("express");
const ejs = require("ejs");//View Engine
const path = require("path");

//Creating server
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
//Setting up ejs
app.set("view engine","ejs");
// app.use(express.static(path.join(__dirname,"/public")));
//GET,POST,PATCH,DELETE
app.get("/",(req,res)=>{
    res.render("index");
});

app.get("/search",(req,res)=>{
    const query = req.query;
    const question = query.question;
    
    stopwords=['what', 'do', 'how', 'under', 'their', "you're", 'all', "mustn't", 'she', 'should', 'our', 'such', 'than', "you'll", 'ain', 'o', "shan't", 'me', 'before', 'that', "hadn't", 'does', 'were', "couldn't", 'over', 'hasn', 'any', 'off', 'ma', 'has', 'above', 'the', "weren't", 'into', 'through', "she's", 'if', 'by', 'about', 'd', 'i', "that'll", "didn't", 'isn', 'him', 'weren', 'between', 'your', 'down', 'did', 'yours', "aren't", 'mustn', 'at', 're', 'y', 'on', 'too', 'aren', 'why', 'below', 'won', 't', 'up', 'am', 'same', "should've", 'theirs', 'once', 'itself', 'hadn', 'as', 'you', "you've", 'shouldn', 'was', 'nor', 'not', 'are', 'couldn', 'each', 'my', 'they', 'can', 'very', 'm', 'only', "it's", 'with', "hasn't", 'an', "mightn't", 
'out', 'being', 's', 'which', 'ours', 'he', 'been', 'having', 'doesn', 'who', 'herself', 'themselves', 'some', 'after', 'had', 'most', 'whom', 'haven', 'himself', 'have', 'no', 'until', 'wouldn', 'shan', 'we', 'wasn', 'during', 'its', 'ourselves', 'don', 'against', 'again', 'doing', 'when', 'a', "needn't", "wasn't", 'of', 'to', 'yourselves', 'myself', 'now', 'here',"isn't", 'so', 'few', 'his', 'didn', "don't", "you'd", 'her', 'while', 'will', 'from', 'll', "doesn't", 'further', 'and', 'be', 'needn', 'these', 'own', 'then', 'hers', "won't", "wouldn't", 'more', 'where', 'other', 'this', 'both', 'mightn', 'is', 'for', "haven't", 've', "shouldn't", 'because', 'yourself', 'it', 'there', 'them', 'those', 'just', 'but', 'or', 'in','\n','\\n',',']
    
    var fs = require('fs')
    var keywords = fs.readFileSync('KEY.txt').toString().replace(/\r\n/g,'\n').split('\n')
    var idf = fs.readFileSync('ID.txt').toString().replace(/\r\n/g,'\n').split('\n')
    var mag = fs.readFileSync('MAG.txt').toString().replace(/\r\n/g,'\n').split('\n')
    var tf = fs.readFileSync('TI.txt').toString().replace(/\r\n/g,'\n').split('\n')
    var name = fs.readFileSync('problem_titles.txt').toString().replace(/\r\n/g,'\n').split('\n');
    var prob_url = fs.readFileSync('problem_url.txt').toString().replace(/\r\n/g,'\n').split('\n');
    
    idf = idf.map(Number)
    mag = mag.map(Number)

    const rows=1539
    const cols=keywords.length

    var ranking=[];

    for(let i=0;i<rows;i++)
        {
            var arr=[]
            for (let j = 0; j < cols; j++) {
                arr[j] = 0
            }
            ranking[i]=arr;
        }
    arr=[]
    for(var x=0;x<tf.length;x++)
        {
            tf[x]=tf[x].toLowerCase()
            arr = tf[x].split(' ')
            let i = parseInt(arr[0])
            let j = parseInt(arr[1])
            let k = parseFloat(arr[2])
            ranking[i-1][j-1]=k;
        }
    function process(str) {
        result = []
        words = str.split(' ')
        for (i = 0; i < words.length; i++) {
            word_clean = words[i].split('.').join('')
            if (!stopwords.includes(word_clean)) {
                result.push(word_clean)
            }
        }
        return result.join(' ')
    }


    query_str = process(question)
    var key_str=[]
    key_str = query_str.split(' ')
    ranking_str=[]

    for(let i=0;i<keywords.length;i++)
        {
            ranking_str[i]=0;
            for(j=0;j<key_str.length;j++)
                {
                    if(keywords[i]==key_str[j])
                        ranking_str[i]+=idf[i];
                }
            ranking_str[i] = ranking_str[i]/key_str.length;
        }
    mag_str=0.0;
    for(i=0;i<ranking_str.length;i++)
    {
        mag_str = mag_str + (ranking_str[i] * ranking_str[i]);
    }
    mag_str = Math.sqrt(mag_str);
    similarity=[]
    for(let i=0;i<rows;i++)
    {
        s=0;
        for(let j=0;j<keywords.length;j++)
        {
            s = s+(ranking[i][j]*ranking_str[j]);
        }
        s = s / (mag_str*mag[i]);

        similarity.push(s);
    }
//console.log(sim)
    

    finalList=[]
    for(i=0;i<rows;i++)
    {
        finalList.push([similarity[i],i]);
    }
    finalList.sort(function (a, b) {
    return b[0] - a[0]
    })
    var array1=[]
    for(let i=0;i<5;i++){
        let j=finalList[i][1];
        array1.push({title:name[j],url:prob_url[j]});
    }

    res.json(array1);
});

//Assigning port to our application
app.listen(PORT,()=>{
    console.log("Server is running on port" + PORT);
});