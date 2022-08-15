package app

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (s *Server) ApiStatus() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Content-Type", "application/json")

		response := map[string]string{
			"status": "success",
			"data":   "gruvIt is running",
		}

		c.JSON(http.StatusOK, response)
	}
}

func (s *Server) HandleUpload() gin.HandlerFunc {
	return func(c *gin.Context) {

		palette := c.DefaultQuery("palette", "unknown")
		file, _ := c.FormFile("uploadImg")

		// Upload the file to specific dst.
		c.SaveUploadedFile(file, "./uploads/"+file.Filename)

		GruvboxImg(file.Filename, palette)

		c.String(http.StatusAccepted, fmt.Sprintf("filename: %s, filesize: %d", file.Filename, file.Size))
	}
}

func (s *Server) HandleGetUploadedFile() gin.HandlerFunc {
	return func(c *gin.Context) {

		filename := c.DefaultQuery("file", "unknown")
		c.File(fmt.Sprintf("./uploads/%s", filename))
	}
}
