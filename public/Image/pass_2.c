/*
 *   Program:      SIC - Pass 2
 *   Requirements: input.txt, optab.txt
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#define MAX_SIZE 100
#define MAX_OBJ_SIZE 100
#define MAX_OPTAB_SIZE 22
#define MAX_SYMTAB_SIZE 50

int intial_address = 0;
int start = 0;
int obj_index = 0;
int optab_index = -1;
int symtab_index = -1;
char temp_add[MAX_OBJ_SIZE];
char temp_add_2[MAX_OBJ_SIZE];
char ascii[10];
char text_record[10][10];
int text_record_size = 0;
int start_addr_text_record = 0;
int start_addr_text_record_real = 0;
int start_addr_global = 0;
char temp_oc_string[6];

struct obj
{
    char addr[MAX_SIZE];
    char label[MAX_SIZE];
    char opcode[MAX_SIZE];
    char operand[MAX_SIZE];
};

struct symtab
{
    char addr[MAX_SIZE];
    char name[MAX_SIZE];
};

struct optab
{
    char name[MAX_SIZE];
    char code[MAX_SIZE];
};

typedef struct obj OBJECT;
typedef struct optab OPTAB;
typedef struct symtab SYMTAB;

OPTAB *optab_all = NULL;
SYMTAB *symtab_all = NULL;
OBJECT *objects = NULL;

void remove_nl(char *s)
{
    int i = 0;
    while (s[i] != '\0')
    {
        if (s[i] == '\n')
        {
            s[i] = ' ';
        }
        i++;
    }
}

void write_end_record(FILE *fp)
{
    fprintf(fp, "E^%6X", start_addr_global);
}

void write_size(FILE *fp)
{
    fseek(fp, 0, SEEK_SET);
    fseek(fp, 16, SEEK_CUR);
    fprintf(fp, "%6X\n", start_addr_text_record - start_addr_global);
}

void write_text_record(FILE *fp)
{
    if (text_record_size == 0)
    {
        return;
    }
    int size = 0;
    for (int i = 0; i < text_record_size; i++)
    {
        size += strlen(text_record[i]) / 2;
    }
    fprintf(fp, "T^%6X^%2X", start_addr_text_record_real, size);
    for (int i = 0; i < text_record_size; i++)
    {
        fprintf(fp, "^");
        fprintf(fp, "%s", text_record[i]);
    }
    fprintf(fp, "\n");
    text_record_size = 0;
    start_addr_text_record_real = start_addr_text_record;
}

void add_to_record(FILE *fp, char *s)
{
    if (!strcmp(s, "\0") || !strcmp(s, "") || !strcmp(s, " "))
    {
        return;
    }
    int size = 0;
    for (int i = 0; i < text_record_size; i++)
    {
        size += strlen(text_record[i]) / 2;
    }
    if ((size + (strlen(s) / 2)) > 30)
    {
        write_text_record(fp);
    }
    strcpy(text_record[text_record_size++], s);
}

void get_object_code(char *oc, char *opc, char *opr)
{
    strcpy(oc, opc);
    strcat(oc, opr);
}

void create_optab()
{
    if (optab_all == NULL)
    {
        optab_all = (OPTAB *)malloc(sizeof(OPTAB) * 22);
    }
    else
    {
        return;
    }
    char temp_string[5];
    FILE *fp = fopen("optab.txt", "r+");
    if (fp == NULL)
    {
        printf("Error ");
        exit(-1);
    }
    while (!feof(fp))
    {
        optab_index++;
        fscanf(fp, "%s %s", optab_all[optab_index].name, optab_all[optab_index].code);
    }
    fclose(fp);
    printf("Optab read!\n");
}

OBJECT insert_tokens(char *s)
{
    OBJECT obj;
    strcpy(obj.label, " ");
    strcpy(obj.operand, " ");
    strcpy(obj.opcode, " ");

    char *token = NULL;
    char s1[MAX_SIZE];
    char s2[MAX_SIZE];
    char s3[MAX_SIZE];
    char s4[MAX_SIZE];

    token = strtok(s, " ");
    if (token == NULL)
        strcpy(s1, " ");
    else
    {
        strcpy(s1, token);
    }

    token = strtok(NULL, " ");
    if (token == NULL)
        strcpy(s2, " ");
    else
    {
        strcpy(s2, token);
    }

    token = strtok(NULL, " ");
    if (token == NULL)
        strcpy(s3, " ");
    else
    {
        strcpy(s3, token);
    }

    token = strtok(NULL, " ");
    if (token == NULL)
        strcpy(s4, " ");
    else
    {
        strcpy(s4, token);
    }

    if (!strcmp(s3, " ") && !strcmp(s4, " "))
    {
        strcpy(obj.addr, s1);
        strcpy(obj.opcode, s2);
    }
    else if (!strcmp(s4, " "))
    {
        strcpy(obj.addr, s1);
        strcpy(obj.opcode, s2);
        strcpy(obj.operand, s3);
    }
    else
    {
        strcpy(obj.addr, s1);
        strcpy(obj.label, s2);
        strcpy(obj.opcode, s3);
        strcpy(obj.operand, s4);
    }
    return obj;
}

SYMTAB insert_symtab(char *s)
{
    SYMTAB obj;
    strcpy(obj.addr, " ");
    strcpy(obj.name, " ");

    char *token = NULL;
    char s1[MAX_SIZE];
    char s2[MAX_SIZE];

    token = strtok(s, " ");
    if (token == NULL)
        strcpy(s1, " ");
    else
        strcpy(s1, token);

    token = strtok(NULL, " ");
    if (token == NULL)
        strcpy(s2, " ");
    else
        strcpy(s2, token);

    strcpy(obj.addr, s1);
    strcpy(obj.name, s2);

    return obj;
}

void create_symtab()
{
    symtab_all = (SYMTAB *)malloc(sizeof(SYMTAB) * MAX_SYMTAB_SIZE);
    char temp_string[MAX_OBJ_SIZE];
    if (symtab_all == NULL)
    {
        printf("Error in allocating memory!");
        exit(-1);
    }
    FILE *fp = fopen("symtab.txt", "r+");
    while (!feof(fp))
    {
        fgets(temp_string, MAX_OBJ_SIZE, fp);
        remove_nl(temp_string);
        symtab_all[++symtab_index] = insert_symtab(temp_string);
    }
    printf("Symtab read!\n");
    fclose(fp);
}

char *get_label_address(OBJECT o)
{

    char label[MAX_OBJ_SIZE];
    strcpy(label, o.operand);
    int j = 0;
    int change_bit = 0;
    char change_bit_str[2] = {' ', '\0'};
    int index_addr_flag = 0;
    strcpy(temp_add_2, o.operand);
    while (o.operand[j] != '\0')
    {
        if (o.operand[j] == ',')
        {
            temp_add_2[j] = '\0';
            index_addr_flag = 1;
            break;
        }
        j++;
    }

    if (!strcmp(o.opcode, "RESB") || !strcmp(o.opcode, "RESW") || !strcmp(o.opcode, "BYTE") || !strcmp(o.opcode, "WORD") || !strcmp(o.opcode, "END"))
    {
        return "\0";
    }
    if (!strcmp(" ", label) || !strcmp("", label))
    {
        return "0000";
    }
    for (int i = 0; i <= symtab_index; i++)
    {
        if (index_addr_flag)
        {

            if (!strcmp(symtab_all[i].name, temp_add_2))
            {
                change_bit_str[0] = symtab_all[i].addr[0];
                change_bit = strtol(change_bit_str, NULL, 16);
                change_bit += 8;
                itoa(change_bit, temp_add, 16);
                strcat(temp_add, symtab_all[i].addr + 1);
                return temp_add;
            }
        }
        else
        {
            if (!strcmp(symtab_all[i].name, label))
            {
                return symtab_all[i].addr;
            }
        }
    }
    return "0000";
}

char *get_optab_code(OBJECT o)
{

    char *temp_s;
    char *temp;
    int i = 0;
    int temp_num = 0;
    int flag = 0;
    if (!strcmp(o.opcode, "RESB") || !strcmp(o.opcode, "RESW") || !strcmp(o.opcode, "END"))
    {
        return "\0";
    }
    if (!strcmp(o.opcode, "BYTE"))
    {
        strcpy(temp_s, o.operand);
        while (temp_s[i] != '\0')
        {
            i++;
        }
        temp_s[i - 1] = '\0';
        if (o.operand[0] == 'C')
        {
            i = 2;
            while (temp_s[i] != '\0')
            {
                // printf(">> %d\n", temp_num);
                temp_num = (int)temp_s[i];
                sprintf(temp, "%X", temp_num);
                strcat(ascii, temp);
                i++;
            }
            return ascii;
        }
        else
        {
            return temp_s + 2;
        }
    }
    if (!strcmp(o.opcode, "WORD"))
    {
        strcpy(temp_oc_string, "0");
        temp_num = 5 - strlen(o.operand);
        for (int i = 0; i < temp_num; i++)
        {
            strcat(temp_oc_string, "0");
        }
        temp_num = strtol(o.operand, NULL, 10);
        sprintf(temp_s, "%X", temp_num);
        strcat(temp_oc_string, temp_s);
        return temp_oc_string;
    }
    char op[MAX_SIZE];
    strcpy(op, o.opcode);
    for (int i = 0; i <= optab_index; i++)
    {
        if (!strcmp(optab_all[i].name, op))
        {
            return optab_all[i].code;
        }
    }
    return "00";
}

int main()
{
    FILE *fp;
    OBJECT temp_obj;
    char temp_string[MAX_SIZE];
    int last_address = 0;
    int start_flag = 0;
    char temp_object_code[MAX_OBJ_SIZE];
    create_optab();
    create_symtab();
    FILE *input_file = fopen("pass1_output.txt", "r+");
    FILE *output_file = fopen("output.txt", "w+");
    FILE *object_program = fopen("object_program.txt", "w+");
    fgets(temp_string, MAX_SIZE, input_file);
    remove_nl(temp_string);
    temp_obj = insert_tokens(temp_string);
    if (!strcmp(temp_obj.opcode, "START"))
    {
        fprintf(output_file, "%-10s %-10s %-10s %-10s\n", "$", temp_obj.label, temp_obj.opcode, temp_obj.operand);
        fprintf(object_program, "H^%6s^%6s^%6s\n", temp_obj.label, temp_obj.operand, "0000");
        start_addr_text_record = strtol(temp_obj.operand, NULL, 16);
        start_addr_text_record_real = start_addr_text_record;
        start_addr_global = start_addr_text_record;
        start_flag = 1;
    }
    while (!feof(input_file))
    {
        if (start_flag != 1)
        {
            get_object_code(temp_object_code, get_optab_code(temp_obj), get_label_address(temp_obj));
            start_addr_text_record = strtol(temp_obj.addr, NULL, 16);
            add_to_record(object_program, temp_object_code);
            fprintf(output_file, "%-10s %-10s %-10s %-10s %s\n", temp_obj.addr, temp_obj.label, temp_obj.opcode, temp_obj.operand, temp_object_code);
            start_flag = 1;
            continue;
        }
        fgets(temp_string, MAX_SIZE, input_file);
        if (temp_string[0] == '.')
        {
            printf("Comment: %s\n", temp_string);
            continue;
        }
        if (!strcmp(temp_obj.opcode, "RESW") || !strcmp(temp_obj.opcode, "RESB"))
        {
            write_text_record(object_program);
        }
        remove_nl(temp_string);
        temp_obj = insert_tokens(temp_string);
        get_object_code(temp_object_code, get_optab_code(temp_obj), get_label_address(temp_obj));
        start_addr_text_record = strtol(temp_obj.addr, NULL, 16);
        add_to_record(object_program, temp_object_code);
        fprintf(output_file, "%-10s %-10s %-10s %-10s %s\n", temp_obj.addr, temp_obj.label, temp_obj.opcode, temp_obj.operand, temp_object_code);
    }
    write_text_record(object_program);
    write_end_record(object_program);
    write_size(object_program);
    fclose(input_file);
    fclose(output_file);
    fclose(object_program);
    return 0;
}