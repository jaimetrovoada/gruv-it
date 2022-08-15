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
		if err := c.SaveUploadedFile(file, "./uploads/"+file.Filename); err != nil {
			c.JSON(http.StatusInternalServerError, "Upload Failed")
		}

		successRes := map[string]interface{}{
			"filename": file.Filename,
			"filesize": file.Size,
		}
		c.JSON(http.StatusAccepted, successRes)

		if err := GruvboxImg(file.Filename, palette); err != nil {
			gruvboxFailedRes := map[string]interface{}{
				"message": "Failed to gruvbox the image(s)",
				"error":   err,
			}
			c.JSON(http.StatusInternalServerError, gruvboxFailedRes)
		}
	}
}

func (s *Server) HandleGetUploadedFile() gin.HandlerFunc {
	return func(c *gin.Context) {

		filename := c.DefaultQuery("file", "unknown")
		c.File(fmt.Sprintf("./uploads/%s", filename))
	}
}
