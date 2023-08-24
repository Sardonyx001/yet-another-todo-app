"use client";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { trpc } from "../_trpc/client";
import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server";

export default function TodoList() {
    const getTodos = trpc.getTodos.useQuery(undefined,{
        refetchOnMount: false,
        refetchOnReconnect: false,
    });
    const addTodo = trpc.addTodo.useMutation({
        onSettled: () => {
            getTodos.refetch();
        },
    });

    const setDone = trpc.setDone.useMutation({
        onSettled: () => {
            getTodos.refetch();
        },
    });

    const updateTodo = trpc.updateTodo.useMutation({
        onSettled: () => {
            getTodos.refetch();
        }
    })

    const deleteTodo = trpc.deleteTodo.useMutation({
        onSettled: () => {
            getTodos.refetch();
        },
    });

    const [content, setContent] = useState("");

    const onDragEnd = (
        result: inferRouterOutputs<AppRouter>['getTodos'] | DropResult
        ) => {
        
    };

    return (
        <div className="p-4 space-y-4">
            <div className="border p-4 rounded-lg shadow-md bg-white dark:bg-gray-800">
                <div className="flex space-x-2">
                    <input
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={ async (e) => {
                            if (e.key === 'Enter' && content.trim() !== '') {
                                e.preventDefault(); 
                                addTodo.mutate(content);
                                setContent('');
                            }
                        }}
                        className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    <button
                        onClick={async () => {
                            if (content.length) {
                                addTodo.mutate(content);
                                setContent("");
                            }
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Add
                    </button>
                </div>
            </div>

            <div className="border p-4 rounded-lg shadow-md bg-white dark:bg-gray-800">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Todo List</h2>
                <DragDropContext onDragEnd={onDragEnd}>
                    <ul>
                        {getTodos?.data?.map((todo) => (
                            <li key={todo.id} className="flex items-center mb-2">
                                <input
                                    id={`check-${todo.id}`}
                                    type="checkbox" 
                                    checked={!!todo.done}
                                    className="mr-2 h-5 w-5 text-blue-500 focus:ring focus:ring-blue-300"
                                    onChange={async () => {
                                        setDone.mutate({
                                            id: todo.id,
                                            done: todo.done ? 0 : 1,
                                        });
                                    }}
                                    />
                                <label
                                    htmlFor={`check-${todo.id}`}
                                    className={`flex-grow cursor-pointer ${
                                        todo.done ? "line-through text-gray-500" : "text-gray-800 dark:text-white"
                                    }`}
                                    >
                                    {todo.content}
                                </label>
                                <button
                                    id={`del-${todo.id}`}
                                    onClick={async () => {
                                        deleteTodo.mutate({
                                            id: todo.id,
                                        });
                                    }}
                                    className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-md text-xs px-2 py-1 ml-2 bg-red-100 dark:bg-red-800 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                                    >
                                    x
                                </button>
                            </li>
                        ))}
                    </ul>
                </DragDropContext>
            </div>
        </div>
    );
}
