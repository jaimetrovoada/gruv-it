package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func HandleUpload(c *gin.Context) {

	palette := c.DefaultQuery("palette", "unknown")
	file, _ := c.FormFile("uploadImg")

	// Upload the file to specific dst.
	c.SaveUploadedFile(file, "./uploads/"+file.Filename)

	gruvboxImg(file.Filename, palette)

	c.String(http.StatusAccepted, fmt.Sprintf("filename: %s, filesize: %d", file.Filename, file.Size))

}
func HandleGetUploadedFile(c *gin.Context) {

	filename := c.DefaultQuery("file", "unknown")
	c.File(fmt.Sprintf("./uploads/%s", filename))
}

func gruvboxImg(imageName string, palette string) {

	if palette == "both" {

		cmd := exec.Command("gruvbox-factory", "-p", "pink", "-i", fmt.Sprintf("./uploads/%s", imageName))
		if err := cmd.Run(); err != nil {
			log.Fatal(err)
		}
		if err := os.Rename(fmt.Sprintf("./uploads/gruvbox_%s", imageName), fmt.Sprintf("./uploads/gruvbox_pink_%s", imageName)); err != nil {
			log.Fatal(err)
		}

		cmdTwo := exec.Command("gruvbox-factory", "-p", "white", "-i", fmt.Sprintf("./uploads/%s", imageName))
		if err := cmdTwo.Run(); err != nil {
			log.Fatal(err)
		}
		if err := os.Rename(fmt.Sprintf("./uploads/gruvbox_%s", imageName), fmt.Sprintf("./uploads/gruvbox_white_%s", imageName)); err != nil {
			log.Fatal(err)
		}
	} else {

		cmd := exec.Command("gruvbox-factory", "-p", palette, "-i", fmt.Sprintf("./uploads/%s", imageName))
		err := cmd.Run()
		if err != nil {
			log.Fatal(err)
		}
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
