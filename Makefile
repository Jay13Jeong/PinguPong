all :
	docker-compose up --build

clean :
	docker-compose -f docker-compose.yaml down
	rm -rf ./pong_database/db

fclean : clean
	docker rmi -f $(shell docker images -a -q)
	docker system prune -f


re : clean all

.PHONY: all clean fclean re