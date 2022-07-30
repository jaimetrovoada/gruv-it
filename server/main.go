package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/exec"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func HandleUpload(c *gin.Context) {

	file, _ := c.FormFile("uploadImg")

	// Upload the file to specific dst.
	c.SaveUploadedFile(file, "./uploads/"+file.Filename)

	env := getEnv()
	if env == "dev" {
		gruvboxImg(file.Filename)
	}

	c.String(http.StatusAccepted, fmt.Sprintf("filename: %s, filesize: %d", file.Filename, file.Size))

}
func HandleGetUploadedFile(c *gin.Context) {

	filename := c.DefaultQuery("file", "unknown")
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

	fmt.Printf("env: %s\n", getEnv())

	return r
}

func getEnv() string {
	// err := godotenv.Load(".env")
	//
	// if err != nil {
	// 	log.Fatalf("Error loading .env file")
	// }

	return os.Getenv("APP_ENV")
}

func main() {

	r := setupRouter()

	r.Run()

}
