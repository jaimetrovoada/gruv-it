package main

import (
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/gin-gonic/gin"
)

func HandleUpload(c *gin.Context) {

	file, _ := c.FormFile("uploadImg")

	// Upload the file to specific dst.
	c.SaveUploadedFile(file, "./uploads/"+file.Filename)

	c.String(http.StatusAccepted, fmt.Sprintf("filename: %s, filesize: %d", file.Filename, file.Size))

}

func GetUploadedFiles(w http.ResponseWriter, r *http.Request) {
	files, err := ioutil.ReadDir("./uploads")
	if err != nil {
		fmt.Println(err)
		return
	}

	for _, file := range files {
		fmt.Fprintf(w, "%s\n", file.Name())
	}
}
func bodySizeMiddleware(c *gin.Context) {
	var w http.ResponseWriter = c.Writer
	var maxBodyBytes int64 = 1024 * 1024 * 8 // 5MB
	c.Request.Body = http.MaxBytesReader(w, c.Request.Body, maxBodyBytes)

	c.Next()
}

func setupRouter() *gin.Engine {
	r := gin.Default()

	r.MaxMultipartMemory = 8 << 20 // 8 MiB

	r.Use(bodySizeMiddleware)

	r.POST("/upload", HandleUpload)

	return r
}

func main() {

	r := setupRouter()

	r.Run()

}
