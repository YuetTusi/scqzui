import styled from 'styled-components';

export const AuthBox = styled.div<{
    deny: boolean,
    layout?: 'block' | 'inline-block' | 'inline'
    | 'flex' | 'inline-flex' | 'grid' | 'inline-grid'
    | 'table' | 'inline-table' | 'list-item'
}>`

    display: ${({ deny, layout }) => (deny ? 'none' : (layout ?? 'block'))};
`;