package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os/exec"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func HandleUpload(c *gin.Context) {

	file, _ := c.FormFile("uploadImg")

	// Upload the file to specific dst.
	c.SaveUploadedFile(file, "./uploads/"+file.Filename)

	gruvboxImg(file.Filename)

	c.String(http.StatusAccepted, fmt.Sprintf("filename: %s, filesize: %d", file.Filename, file.Size))

}
func HandleGetUploadedFile(c *gin.Context) {

	filename := c.DefaultQuery("file", "unknown")
	// file, err := ioutil.ReadFile(fmt.Sprintf("./uploads/%s", filename))
	// if err != nil {
	// 	fmt.Println(err)
	// 	return
	// }
	// fi, err := os.Stat(fmt.Sprintf("./uploads/%s", filename))
	// if err != nil {
	// 	log.Fatalf("error getting uploaded file")
	// 	return
	// }
	//
	// reader := file
	// defer reader.Close()
	//
	// contentLength := fi.Size()
	// contentType := "application/octet-stream"
	//
	// extraHeaders := map[string]string{
	// 	"Content-Disposition": fmt.Sprintf(`attachment; filename="gopher.png"`, filename),
	// }
	//
	// c.DataFromReader(http.StatusOK, contentLength, contentType, reader, extraHeaders)
	c.File(fmt.Sprintf("./uploads/%s", filename))
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

func gruvboxImg(imageName string) {

	cmd := exec.Command("gruvbox-factory", "-i", fmt.Sprintf("./uploads/%s", imageName))
	err := cmd.Run()

	if err != nil {
		log.Fatal(err)
	}

}

func setupRouter() *gin.Engine {
	r := gin.Default()

	r.MaxMultipartMemory = 8 << 20 // 8 MiB

	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowMethods = []string{"GET", "POST"}
	config.AllowHeaders = []string{"Origin"}

	r.Use(bodySizeMiddleware, cors.New(config))

	r.POST("/upload", HandleUpload)
	r.GET("/image", HandleGetUploadedFile)

	return r
}

func main() {

	r := setupRouter()

	r.Run()

}
