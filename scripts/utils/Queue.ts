module DataStructures
{
    export class Queue<T>
    {
        head: Node<T>;
        tail: Node<T>;

        constructor()
        {
            this.head = null;
        }

        add(item: T)
        {
            var newNode = new Node<T>(item);
            if(this.head == null)
            {
                this.head = newNode;
                this.tail = newNode;
                return;
            }

            this.tail.next = newNode;
            this.tail = newNode;
        }

        addMultiple(itemArray: Array<T>)
        {
            for(var index in itemArray)
            {
                this.add(itemArray[index]);
            }
        }

        pop(): T
        {
            if(this.head == null) return null;

            var tempHead = this.head;
            this.head = this.head.next;

            //If the new head is also the tail, then set the tail to null too
            if(this.head == null)
                this.tail = null;
            return tempHead.element;
        }

        size(): number
        {
            if(this.head == null)
            {
                return 0;
            }
            var currentNode = this.head,
                counter = 1;
            while(currentNode.next != null)
            {
                currentNode = currentNode.next;
                counter++;
            }
            return counter;
        }

        isEmpty(): boolean
        {
            return this.head == null;
        }
    }

    export class Node<T>
    {
        element: T;
        next: Node<T>;

        constructor(item: T)
        {
            this.element = item;
            this.next = null;
        }
    }
}