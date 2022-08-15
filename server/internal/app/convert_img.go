package app

import (
	"fmt"
	"log"
	"os"
	"os/exec"
)

func GruvboxImg(imageName string, palette string) {

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
