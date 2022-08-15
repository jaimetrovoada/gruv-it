package main

import (
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jaimetrovoada/gruv-it/server/internal/app"
)

func bodySizeMiddleware(c *gin.Context) {
	var w http.ResponseWriter = c.Writer
	var maxBodyBytes int64 = 1024 * 1024 * 8 // 5MB
	c.Request.Body = http.MaxBytesReader(w, c.Request.Body, maxBodyBytes)

	c.Next()
}

func run() error {
	r := gin.Default()

	r.MaxMultipartMemory = 8 << 20 // 8 MiB

	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowMethods = []string{"GET", "POST"}
	config.AllowHeaders = []string{"Origin"}

	r.Use(bodySizeMiddleware, cors.New(config))

	server := app.NewServer(r)

	if err := server.Run(); err != nil {
		return err
	}

	return nil
}

func main() {

	if err := run(); err != nil {
		log.Fatal(err)
	}

}
