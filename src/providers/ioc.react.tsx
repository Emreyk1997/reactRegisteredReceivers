import React, { useContext } from 'react';
import { Container, interfaces } from 'inversify';

//For TypeScript, we give the type of container
const InversifyContext = React.createContext<{ container: Container | null }>({ container: null });

type Props = {
    container: Container;
};

export const Provider: React.FC<Props> = (props) => {
    return (
        <InversifyContext.Provider value={{ container: props.container }}>
            {props.children}
        </InversifyContext.Provider>
    );
};

//In TypeScript, T is a special return value and captures the type user enters
//Like any, but with better information in it
//Can be useful after
export function useInjection<T>(identifier: interfaces.ServiceIdentifier<T>) {
    const { container } = useContext(InversifyContext);
    if (!container) { throw new Error(); }
    return container.get<T>(identifier);
};