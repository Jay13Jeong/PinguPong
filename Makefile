all :
	docker-compose up --build

clean :
	docker-compose -f docker-compose.yaml down
	rm -rf ./pong_database/db
	mv -f ./pong_nestjs/avatars/default.jpeg ./
	rm -f ./pong_nestjs/avatars/*
	mv -f ./default.jpeg ./pong_nestjs/avatars/

fclean : clean
	docker rmi -f $(shell docker images -a -q)
	docker system prune -f

re : clean all

.PHONY: all clean fclean re