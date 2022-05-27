# Search-Engine-_SearchGuru
# DSA PROBLEM SEARCH ENGINE

This is a project that eases the efforts required to migrate and search the questions of interviews regarding DSA. This search engine is an aid to the aspiring programmers as it brings the neccessity to there doorstep.


## Deployment

To deploy this project run on the local server

```bash
  npm run start
```
The project is deployed on heroku and the link to the same is accessible as https://cp-guru-search.herokuapp.com/

For deploying the changes made to the project the command goes as follows

```bash
  git add .
  git commit -m "make it better"
  git push heroku main
```
## Development of the Code
In order to develop the code locally three major steps were used.

1. Creation of Corpus
2. Creation of data files
3. Forming the backend and frontend

The first of creating the corpus is pretty straight forward. The question were scraped from various websites related to dsa problems using BeautifulSoup.
The code for the same is shown below

```bash
import time
from selenium import webdriver
from bs4 import BeautifulSoup
from webdriver_manager.chrome import ChromeDriverManager
driver = webdriver.Chrome(ChromeDriverManager().install())
driver.get("url of the page")
time.sleep(5)

html = driver.page_source

soup = BeautifulSoup(html, 'html.parser')

#Using the specific class name to scarpe the required data
all_ques_div = soup.findAll("div", {"class":"problem-tagbox-inner"})
all_ques=[]
for ques in all_ques_div:
    all_ques.append(ques.findAll("div")[0].find("a"))
dummyurl=[]
url =[]
titles=[]
for ques in all_ques:
    url.append("url of the main page" + ques['href'])
    dummyurl.append("url of the main page" + ques['href'])
    titles.append(ques.text)

#Creating the url file to store the urls of the problems
# with open("problem_url.txt","a+") as f:
#     f.write('\n'. join(url))

#Creating the title file to store the titles of each problem
# with open("problem_titles.txt","a+") as f:
#     f.write('\n'. join(titles))

#The next three lines are for deleting the questions that are no longer available on the page
cnt =1471;
#for i in range(165):
#    del dummyurl[0]

#Creating multiple files to store the descriptions of respective problems
for urls in dummyurl:
    driver.get(urls)
    time.sleep(5)
    cnt+=1
    html1 = driver.page_source
    soup1 = BeautifulSoup(html1,'html.parser')
    problem_text = soup1.find("div",{"class":"problem-statement"}).text
    problem_text = problem_text.encode("utf-8")
    problem_text =  str(problem_text)
    with open("problem"+str(cnt)+".txt","w+") as f:
        f.write(problem_text.strip())
```
Now inorder to move forward we need some more datafiles as per step two. These files respectively store the keywords in the corpus as "keywords_final.txt" , the occurence of each keyword in a given problem as "tf_final.txt", the magnitude of the tf vectors of each problem as "mag_final.txt", the idf of each keyword as "idf_final.txt" and the size of each question as "length_final.txt".

The code for the above is as follows
```bash
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import math

stop=set(stopwords.words('english'))
stri=""


import os
  
# Folder Path
path = r"path of the project folder"
  
# Change the directory
os.chdir(path)

key =list()
# iterate through all file
for file in os.listdir():
    # Check whether file is in text format or not
    if file.endswith(".txt"):
        file_path = f"{path}\{file}"
        with open(file_path) as f:
            data =f.readlines()
            for x in data:
                val=x.strip()
                stri=stri+val
            tok=word_tokenize(stri)
            ans=list()
            for i in range(0,len(tok)):
                if tok[i].lower() in stop:
                    pass
                else:
                    ans.append(tok[i])
            none=""
            ans = list(map(lambda x: x.replace('\n',none).replace('\\n',none).replace(',',none),ans))
            for i in range(len(ans)-1):
                ans[i]=ans[i].lower()
                if ans[i]=='' or ans[i]=='.' or ans[i].isalpha() == False:
                    pass
                else:
                    key.append(ans[i])
            ans.clear()
            stri=""

key_final=list()

for i in key:
    if i in key_final:
        pass
    else:
        key_final.append(i)

key_final.sort()

#Creating the keyword file
# with open("keywords_final.txt","a+") as f:
#     f.write('\n'.join(key_final))

#Creating the idf file
nt = []
for i in key_final:
    nt.append(key.count(i))

idf =[]
cnt = 0
for i in key_final:
    idf.append((math.log10(1539/float(nt[cnt])))+1)
    cnt +=1
with open("idf_final.txt","a+") as f:
        for x in idf:
            f.write("%s\n" % x)
``` 
The idf is calculated as,

IDF = log(N/nt)+1
N : corpus size
nt : frequency of a given keyword in the corpus

The other files are created using

```bash
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

stop=set(stopwords.words('english'))
stri=""

with open("idf_final.txt") as f:
    data=f.readlines()
    for x in data:
        stri+=x;
    idf=word_tokenize(stri)
stri=""
import os
  
# Folder Path
path = r"path of the project file"
  
# Change the directory
os.chdir(path)

key =list()
# iterate through all file
for file in os.listdir():
    # Check whether file is in text format or not
    if file.endswith(".txt"):
        file_path = f"{path}\{file}"
        with open(file_path) as f:
            data =f.readlines()
            for x in data:
                val=x.strip()
                stri=stri+val
            tok=word_tokenize(stri)
            ans=list()
            for i in range(0,len(tok)):
                if tok[i].lower() in stop:
                    pass
                else:
                    ans.append(tok[i])
            none=""
            ans = list(map(lambda x: x.replace('\n',none).replace('\\n',none).replace(',',none),ans))
            for i in range(len(ans)-1):
                ans[i]=ans[i].lower()
                if ans[i]=='' or ans[i]=='.' or ans[i].isalpha() == False:
                    pass
                else:
                    key.append(ans[i])
            ans.clear()
            stri=""

key_final=list()

for i in key:
    if i in key_final:
        pass
    else:
        key_final.append(i)

key_final.sort()

key.clear()
z=0
tf=list()
for file in os.listdir():
    # Check whether file is in text format or not
    if file.endswith(".txt"):
        file_path = f"{path}\{file}"
        with open(file_path) as f:
            data =f.readlines()
            for x in data:
                val=x.strip()
                stri=stri+val
            tok=word_tokenize(stri)
            ans=list()
            for i in range(0,len(tok)):
                if tok[i].lower() in stop:
                    pass
                else:
                    ans.append(tok[i])
            none=""
            ans = list(map(lambda x: x.replace('\n',none).replace('\\n',none).replace(',',none),ans))
            for i in range(len(ans)-1):
                ans[i]=ans[i].lower()
                if ans[i]=='' or ans[i]=='.' or ans[i].isalpha() == False:
                    pass
                else:
                    key.append(ans[i])
            ttf=list()
            for i in range(len(key_final)):
                st=""
                st=key_final[i]
                x=key.count(st)
                ttf.append(float(idf[i])*x/len(key))
            tf.append(ttf)
            z+=1
            ans.clear()
            key.clear()
            stri=""

# for i in range(len(tf)):
#     print(tf[i])
import math
tfidf=list()
mag=list()
sqsum=0
for i in range(len(tf)):
    for j in range(len(key_final)):
        sqsum+=tf[i][j]*tf[i][j]
    mag.append(math.sqrt(sqsum))
    sqsum=0


with open("mag_final.txt","a+") as f:
    for x in mag:
        f.write("%s\n" % x)
```
The above code represents the creation of magnitude file.

For creation of remaining files similar template was used.

```bash
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

stop=set(stopwords.words('english'))
stri=""

with open("idf_final.txt") as f:
    data=f.readlines()
    for x in data:
        stri+=x;
    idf=word_tokenize(stri)
stri=""
import os
  
# Folder Path
path = r"path of the project file"
  
# Change the directory
os.chdir(path)

key =list()
# iterate through all file
for file in os.listdir():
    # Check whether file is in text format or not
    if file.endswith(".txt"):
        file_path = f"{path}\{file}"
        with open(file_path) as f:
            data =f.readlines()
            for x in data:
                val=x.strip()
                stri=stri+val
            tok=word_tokenize(stri)
            ans=list()
            for i in range(0,len(tok)):
                if tok[i].lower() in stop:
                    pass
                else:
                    ans.append(tok[i])
            none=""
            ans = list(map(lambda x: x.replace('\n',none).replace('\\n',none).replace(',',none),ans))
            for i in range(len(ans)-1):
                ans[i]=ans[i].lower()
                if ans[i]=='' or ans[i]=='.' or ans[i].isalpha() == False:
                    pass
                else:
                    key.append(ans[i])
            ans.clear()
            stri=""

key_final=list()

for i in key:
    if i in key_final:
        pass
    else:
        key_final.append(i)

key_final.sort()

key.clear()
z=0
tf=list()
tf_fin = list()
len_fin = list()
for file in os.listdir():
    # Check whether file is in text format or not
    if file.endswith(".txt"):
        file_path = f"{path}\{file}"
        with open(file_path) as f:
            data =f.readlines()
            for x in data:
                val=x.strip()
                stri=stri+val
            tok=word_tokenize(stri)
            ans=list()
            for i in range(0,len(tok)):
                if tok[i].lower() in stop:
                    pass
                else:
                    ans.append(tok[i])
            none=""
            ans = list(map(lambda x: x.replace('\n',none).replace('\\n',none).replace(',',none),ans))
            for i in range(len(ans)-1):
                ans[i]=ans[i].lower()
                if ans[i]=='' or ans[i]=='.' or ans[i].isalpha() == False:
                    pass
                else:
                    key.append(ans[i])
            
            for i in range(len(key_final)):
                st=""
                st=key_final[i]
                x=key.count(st)
                
                if x != 0:
                    tf_fin.append(str(z+1)+" "+str(i+1)+" "+str(x))
            
            len_fin.append(len(key))
            z+=1
            ans.clear()
            key.clear()
            stri=""



#Creating the question length file
with open("C:\\Users\\reete\\OneDrive\\Desktop\\nlp2\\length_final.txt","a+") as f:
    for x in len_fin:
        f.write("%s\n" % x)

#Creating the tf file
# with open("C:\\Users\\reete\\OneDrive\\Desktop\\nlp2\\tf_final.txt","a+") as f:
#     for x in tf_fin:
#         f.write("%s\n" % x)
```
Now for building the backend and front end we use create an express app using Node.js

For that we need to install express and ejs. This can be done using the given command

```bash
npm install express ejs
```

Then the backend is created using express. Whenever a request is fired at the frontend the query is sent to the backend using a "/search" route.
This question is the processed using basic language processing procedure of conversion to lower case, removal of punctuation and finally removal of stop words.
Then the processed query is set into series of operation to calculate its tf-idf vector. This vector is then matched with the corpus using cosine similarity and the results are produced.

Cosine similarity is calculated as:

x = arccos(a dot b/(mag(a)*mag(b)))

x : similarity
a : tf-idf vector of the problem
b : tf-idf vector of the query
mag() : this provides the magnitude of the input vector

The code for the backend is as follows:

```bash
//Required modules
const express = require("express");
const ejs = require("ejs");//View Engine
const path = require("path");

var fs = require('fs')
var keywords = fs.readFileSync('keywords_final.txt').toString().replace(/\r\n/g,'\n').split('\n')
var idf = fs.readFileSync('idf_final.txt').toString().replace(/\r\n/g,'\n').split('\n')
var mag = fs.readFileSync('mag_final.txt').toString().replace(/\r\n/g,'\n').split('\n')
var len = fs.readFileSync('length_final.txt').toString().replace(/\r\n/g,'\n').split('\n')
var tf = fs.readFileSync('tf_final.txt').toString().replace(/\r\n/g,'\n').split('\n')
var name = fs.readFileSync('problem_titles.txt').toString().replace(/\r\n/g,'\n').split('\n');
var prob_url = fs.readFileSync('problem_url.txt').toString().replace(/\r\n/g,'\n').split('\n');
idf = idf.map(Number)
mag = mag.map(Number)
len = len.map(Number)


//Creating server
const app = express();
app.use(express.json());
//assigning a port for our app to run
const PORT = process.env.PORT || 3000;
//Setting up ejs
app.set("view engine","ejs");

//GET,POST,PATCH,DELETE
app.get("/",(req,res)=>{
    res.render("index");
});

app.get("/search",(req,res)=>{
    const query = req.query;
    const question = query.question;
    
    stopwords=['what', 'do', 'how', 'under', 'their', "you're", 'all', "mustn't", 'she', 'should', 'our', 'such', 'than', "you'll", 'ain', 'o', "shan't", 'me', 'before', 'that', "hadn't", 'does', 'were', "couldn't", 'over', 'hasn', 'any', 'off', 'ma', 'has', 'above', 'the', "weren't", 'into', 'through', "she's", 'if', 'by', 'about', 'd', 'i', "that'll", "didn't", 'isn', 'him', 'weren', 'between', 'your', 'down', 'did', 'yours', "aren't", 'mustn', 'at', 're', 'y', 'on', 'too', 'aren', 'why', 'below', 'won', 't', 'up', 'am', 'same', "should've", 'theirs', 'once', 'itself', 'hadn', 'as', 'you', "you've", 'shouldn', 'was', 'nor', 'not', 'are', 'couldn', 'each', 'my', 'they', 'can', 'very', 'm', 'only', "it's", 'with', "hasn't", 'an', "mightn't", 
'out', 'being', 's', 'which', 'ours', 'he', 'been', 'having', 'doesn', 'who', 'herself', 'themselves', 'some', 'after', 'had', 'most', 'whom', 'haven', 'himself', 'have', 'no', 'until', 'wouldn', 'shan', 'we', 'wasn', 'during', 'its', 'ourselves', 'don', 'against', 'again', 'doing', 'when', 'a', "needn't", "wasn't", 'of', 'to', 'yourselves', 'myself', 'now', 'here',"isn't", 'so', 'few', 'his', 'didn', "don't", "you'd", 'her', 'while', 'will', 'from', 'll', "doesn't", 'further', 'and', 'be', 'needn', 'these', 'own', 'then', 'hers', "won't", "wouldn't", 'more', 'where', 'other', 'this', 'both', 'mightn', 'is', 'for', "haven't", 've', "shouldn't", 'because', 'yourself', 'it', 'there', 'them', 'those', 'just', 'but', 'or', 'in','\n','\\n',',']

    const rows=1539
    const cols=keywords.length

    var occurance=[];

    for(let i=0;i<rows;i++)
        {
            var arr=[]
            for (let j = 0; j < cols; j++) {
                arr[j] = 0
            }
            occurance[i]=arr;
        }
    arr=[]
    for(var x=0;x<tf.length;x++)
        {
            tf[x]=tf[x].toLowerCase()
            arr = tf[x].split(' ')
            let i = parseInt(arr[0])
            let j = parseInt(arr[1])
            let k = parseFloat(arr[2])
            occurance[i-1][j-1]=((k*idf[j-1])/(len[i-1]));
        }
    function processed(str) {
        result = []
        words = str.split(' ')
        for (i = 0; i < words.length; i++) {
            word = words[i].split('.').join('')
            if (!stopwords.includes(word)) {
                result.push(word)
            }
        }
        return result.join(' ')
    }


    query_str = processed(question)
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
            s = s+(occurance[i][j]*ranking_str[j]);
        }
        s = s / (mag_str*mag[i]);

        similarity.push(s);
    }

    

    finalList=[]
    for(i=0;i<rows;i++)
    {
        finalList.push([similarity[i],i]);
    }
    finalList.sort(function (a, b) {
    return b[0] - a[0]
    })
    var array1=[]
    for(let i=0;i<10;i++){
        let j=finalList[i][1];
        array1.push({title:name[j],url:prob_url[j]});
    }
    

    res.json(array1);
});

//Assigning port to our application
app.listen(PORT,()=>{
    console.log("Server is running on port" + PORT);
});
```
The code for the frontend is as follows:

```bash
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SearchGuru</title>
    <!-- <link href="styles.css"> -->
</head>
<body style="background-color: aqua;"b>
    <h1 style="text-align:center;">SearchGuru</h1>

    <form style="text-align:center ;">
        <input type="text" name="question" id="question">
        <input type="submit" value="Search">
    </form>
    <div class="loading" style="text-align:center;"></div>
    <div class="question" style="text-align:center;">
        <div class="title"></div>
        <div class="url">
            <a href=""></a>
        </div>
    </div>
    <div class="question" style="text-align:center;">
        <div class="title"></div>
        <div class="url">
            <a href=""></a>
        </div>
    </div>
    <div class="question" style="text-align:center;">
        <div class="title"></div>
        <div class="url">
            <a href=""></a>
        </div>
    </div>
    <div class="question" style="text-align:center;">
        <div class="title"></div>
        <div class="url">
            <a href=""></a>
        </div>
    </div>
    <div class="question" style="text-align:center;">
        <div class="title"></div>
        <div class="url">
            <a href=""></a>
        </div>
    </div>
    <div class="question" style="text-align:center;">
        <div class="title"></div>
        <div class="url">
            <a href=""></a>
        </div>
    </div>
    <div class="question" style="text-align:center;">
        <div class="title"></div>
        <div class="url">
            <a href=""></a>
        </div>
    </div>
    <div class="question" style="text-align:center;">
        <div class="title"></div>
        <div class="url">
            <a href=""></a>
        </div>
    </div>
    <div class="question" style="text-align:center;">
        <div class="title"></div>
        <div class="url">
            <a href=""></a>
        </div>
    </div>
    <div class="question" style="text-align:center;">
        <div class="title"></div>
        <div class="url">
            <a href=""></a>
        </div>
    </div>
</body>
</html>

<script>
    const form = document.querySelector("form");
    const questionElement = form.question;

    const questions = document.querySelectorAll(".question");
    const titles = document.querySelectorAll(".title");
    const urls = document.querySelectorAll(".url");
    const loadingDiv = document.querySelector(".loading");

    // console.log(questions);
    // console.log(titles);
    // console.log(urls);

    form.addEventListener("submit",async (e)=>{
        e.preventDefault();
        const question = questionElement.value;
        for (let i = 0; i < 10; i++) {
            titles[i].innerHTML = ``;
            urls[i].innerHTML = ``;
        }

        loadingDiv.innerHTML = `Loading Your Request......`;
        //fetch
        try {
                const res = await fetch(`/search?question=${question}`,{method:"GET",
            });
                const data = await res.json();
            // console.log(data);s

            loadingDiv.innerHTML = ``;
            for(let i=0;i<10;i++){
                titles[i].innerHTML = `<h3>${data[i].title}</h3>`;
                urls[i].innerHTML = `<a href = ${data[i].url} target="_blank" rel="noopener noreferrer">Visit the question!!</a>`;
            }
            
        } catch (error) {
            alert(error);
        }
    });
</script>
```
The CSS inputs were made through inline CSS and can be further altered as per need.

The mathematical calculation required were:

TF = nt(i)/N 

IDF = log(N/nt)

similarity = x = arccos(a dot b/(mag(a)*mag(b)))

where nt(i) represents the occurence of a keyword in i-th document.

## FAQ

#### Can this search engine answer any random query?

No it cannot. It is meant for queries that are somewhat relevant with regards to dsa problems.
